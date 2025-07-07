#!/bin/bash

echo "🚀 Starting Production Deployment..."

# 환경 설정 강제 로드
echo "🔧 Loading environment..."
source ~/.bashrc 2>/dev/null || true
source ~/.profile 2>/dev/null || true

# NVM 환경 로드
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Git 설정
echo "🔧 Configuring Git..."
git config pull.rebase false

# Node.js 버전 확인
echo "📋 Node.js Version:"
node --version

# NPM 버전 확인
echo "📋 NPM Version:"
npm --version

# 의존성 설치
echo "📦 Installing dependencies..."
npm ci

# 빌드
echo "🔨 Building application..."
npm run build

# PM2 프로세스 중지 (존재하는 경우)
echo "🛑 Stopping existing PM2 process..."
pm2 stop the-wedding-lab || true
pm2 delete the-wedding-lab || true

# PM2로 애플리케이션 시작
echo "▶️ Starting application with PM2..."
pm2 start ecosystem.config.js

# PM2 설정 저장
echo "💾 Saving PM2 configuration..."
pm2 save

# 배포 상태 확인
echo "✅ Deployment Status:"
pm2 status

echo "🎉 Production deployment completed successfully!"
echo "🌐 Application is running on: http://localhost:3003" 