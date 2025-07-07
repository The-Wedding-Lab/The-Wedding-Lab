#!/bin/bash

echo "🚀 Starting Production Deployment..."

# 직접 경로 설정 (서버에서 확인된 경로)
NODE_CMD="/root/.nvm/versions/node/v22.17.0/bin/node"
NPM_CMD="/root/.nvm/versions/node/v22.17.0/bin/npm"
PM2_CMD="/root/.nvm/versions/node/v22.17.0/bin/pm2"

# Git 설정
echo "🔧 Configuring Git..."
git config pull.rebase false

# Node.js 버전 확인
echo "📋 Node.js Version:"
$NODE_CMD --version

# NPM 버전 확인
echo "📋 NPM Version:"
$NPM_CMD --version

# 의존성 설치
echo "📦 Installing dependencies..."
$NPM_CMD ci

# 빌드
echo "🔨 Building application..."
$NPM_CMD run build

# PM2 프로세스 중지 (존재하는 경우)
echo "🛑 Stopping existing PM2 process..."
$PM2_CMD stop the-wedding-lab || true
$PM2_CMD delete the-wedding-lab || true

# PM2로 애플리케이션 시작
echo "▶️ Starting application with PM2..."
$PM2_CMD start ecosystem.config.js

# PM2 설정 저장
echo "💾 Saving PM2 configuration..."
$PM2_CMD save

# 배포 상태 확인
echo "✅ Deployment Status:"
$PM2_CMD status

echo "🎉 Production deployment completed successfully!"
echo "🌐 Application is running on: http://localhost:3003" 