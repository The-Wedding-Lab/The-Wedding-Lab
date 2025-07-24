#!/bin/bash

# 오류 발생 시 스크립트 중단
set -e

echo "🚀 Starting Development Deployment..."

# 직접 경로 설정 (서버에서 확인된 경로)
NODE_PATH="/root/.nvm/versions/node/v22.17.0/bin"
NODE_CMD="$NODE_PATH/node"
NPM_CMD="$NODE_PATH/npm"
PM2_CMD="$NODE_PATH/pm2"
NPX_CMD="$NODE_PATH/npx"

# PATH에 Node.js 경로 추가
export PATH="$NODE_PATH:$PATH"

# Git 설정
echo "🔧 Configuring Git..."
git config pull.rebase false

# Node.js 버전 확인
echo "📋 Node.js Version:"
$NODE_CMD --version

# NPM 버전 확인
echo "📋 NPM Version:"
$NPM_CMD --version

# 환경 변수 확인
echo "🔍 Checking environment variables..."
if [ -f ".env.local" ]; then
  echo "✅ .env.local file found"
else
  echo "⚠️ .env.local file not found"
fi

# DATABASE_URL 확인
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️ DATABASE_URL environment variable not set"
else
  echo "✅ DATABASE_URL is configured"
fi

# prisma generate
echo "🔧 Generating Prisma client..."
$NPX_CMD prisma generate

# 의존성 설치
echo "📦 Installing dependencies..."
$NPM_CMD ci

# Prisma DB 동기화
echo "🗄️ Syncing database..."
$NPX_CMD prisma db push || echo "⚠️ Database sync failed, continuing..."

# Prisma 클라이언트 재생성 (의존성 설치 후)
echo "🔧 Re-generating Prisma client after dependencies..."
$NPX_CMD prisma generate

# 빌드
echo "🔨 Building application..."
if ! $NPM_CMD run build; then
  echo "❌ Build failed! Deployment aborted."
  exit 1
fi

# PM2 프로세스 중지 (존재하는 경우)
echo "🛑 Stopping existing PM2 process..."
$PM2_CMD stop the-wedding-lab-dev || true
$PM2_CMD delete the-wedding-lab-dev || true

# 로그 디렉토리 생성
echo "📁 Creating logs directory..."
mkdir -p logs

# PM2로 애플리케이션 시작
echo "▶️ Starting application with PM2..."
if ! $PM2_CMD start node_modules/next/dist/bin/next --name "the-wedding-lab" --interpreter="/root/.nvm/versions/node/v22.17.0/bin/node" -- start -p 3003; then
  echo "❌ Failed to start application with PM2"
  exit 1
fi

# 애플리케이션 시작 확인 (10초 대기)
echo "⏳ Waiting for application to start..."
sleep 10

# PM2 상태 확인
if $PM2_CMD show the-wedding-lab-dev | grep -q "online"; then
  echo "✅ Application is running successfully"
else
  echo "❌ Application failed to start properly"
  $PM2_CMD logs the-wedding-lab-dev --lines 20
  exit 1
fi

# PM2 설정 저장
echo "💾 Saving PM2 configuration..."
$PM2_CMD save

# 배포 상태 확인
echo "✅ Deployment Status:"
$PM2_CMD status

echo "🎉 Development deployment completed successfully!"
echo "🌐 Application is running on: http://localhost:3003" 