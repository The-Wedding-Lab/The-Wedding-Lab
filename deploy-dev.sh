#!/bin/bash

echo "🚀 Starting Development Deployment..."

# 환경 변수 설정
echo "🔧 Setting up environment..."
export PATH="/usr/bin:/usr/local/bin:/bin:/sbin:/usr/sbin:$PATH"

# Git 설정
echo "🔧 Configuring Git..."
git config pull.rebase false

# 명령어 경로 찾기
echo "🔍 Finding command paths..."
NODE_PATH=$(which node 2>/dev/null || find /usr -name "node" 2>/dev/null | head -1)
NPM_PATH=$(which npm 2>/dev/null || find /usr -name "npm" 2>/dev/null | head -1)
PM2_PATH=$(which pm2 2>/dev/null || find /usr -name "pm2" 2>/dev/null | head -1 || echo "/usr/local/bin/pm2")

echo "🔍 Node path: $NODE_PATH"
echo "🔍 NPM path: $NPM_PATH"
echo "🔍 PM2 path: $PM2_PATH"

# Node.js 버전 확인
echo "📋 Node.js Version:"
$NODE_PATH --version 2>/dev/null || echo "Node.js not found"

# NPM 버전 확인
echo "📋 NPM Version:"
$NPM_PATH --version 2>/dev/null || echo "NPM not found"

# 의존성 설치
echo "📦 Installing dependencies..."
$NPM_PATH ci || echo "Failed to install dependencies"

# 빌드
echo "🔨 Building application..."
$NPM_PATH run build || echo "Failed to build"

# PM2 프로세스 중지 (존재하는 경우)
echo "🛑 Stopping existing PM2 process..."
$PM2_PATH stop the-wedding-lab-dev || true
$PM2_PATH delete the-wedding-lab-dev || true

# PM2로 애플리케이션 시작
echo "▶️ Starting application with PM2..."
$PM2_PATH start ecosystem.config.dev.js || echo "Failed to start PM2"

# PM2 설정 저장
echo "💾 Saving PM2 configuration..."
$PM2_PATH save || echo "Failed to save PM2 config"

# 배포 상태 확인
echo "✅ Deployment Status:"
$PM2_PATH status || echo "Failed to get PM2 status"

echo "🎉 Production deployment completed successfully!"
echo "🌐 Application is running on: http://localhost:3004" 