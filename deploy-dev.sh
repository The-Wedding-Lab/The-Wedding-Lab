#!/bin/bash

echo "🚀 Starting Development Deployment..."

# Git 설정
echo "🔧 Configuring Git..."
git config pull.rebase false

# Node.js 버전 확인 (시스템 설치된 버전)
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
pm2 stop the-wedding-lab-dev || true
pm2 delete the-wedding-lab-dev || true

# PM2로 애플리케이션 시작
echo "▶️ Starting application with PM2..."
pm2 start ecosystem.config.dev.js

# PM2 설정 저장
echo "💾 Saving PM2 configuration..."
pm2 save

# 배포 상태 확인
echo "✅ Deployment Status:"
pm2 status

echo "🎉 Production deployment completed successfully!"
echo "🌐 Application is running on: http://localhost:3004" 