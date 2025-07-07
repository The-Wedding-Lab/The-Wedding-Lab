# GitHub CI/CD 배포 가이드 (SSH 방식)

## 개요

이 프로젝트는 GitHub Actions와 SSH를 사용하여 자동 배포를 수행합니다.

- **main 브랜치**: 프로덕션 환경 (포트 3003)
- **develop 브랜치**: 개발 환경 (포트 3004)

## 사전 요구사항

### 1. 서버 환경 설정

```bash
# Node.js 22 설치
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 설치
npm install -g pm2

# 프로젝트 클론
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/The-Wedding-Lab.git
cd The-Wedding-Lab
```

### 2. GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions에서 다음 값들을 설정:

- `HOST`: 서버 IP 주소
- `USERNAME`: SSH 사용자명 (예: ubuntu)
- `SSH_PRIVATE_KEY`: SSH 개인키 내용

#### SSH 키 생성 방법:

```bash
# 서버에서 SSH 키 생성
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 공개키를 authorized_keys에 추가
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

# 개인키 내용을 GitHub Secrets에 추가
cat ~/.ssh/id_rsa
```

### 3. 배포 스크립트 권한 설정

```bash
# 서버에서 실행
chmod +x deploy.sh deploy-dev.sh
```

## 배포 프로세스

### 자동 배포

1. **main 브랜치**: 코드 push 시 `deploy.sh` 실행 → 포트 3003에 배포
2. **develop 브랜치**: 코드 push 시 `deploy-dev.sh` 실행 → 포트 3004에 배포

### 수동 배포

```bash
# 프로덕션 환경
./deploy.sh

# 개발 환경
./deploy-dev.sh
```

## 배포 스크립트 구성

### deploy.sh (프로덕션)

- Node.js/NPM 버전 확인
- 의존성 설치 (`npm ci`)
- 애플리케이션 빌드 (`npm run build`)
- 기존 PM2 프로세스 중지
- 새 프로세스 시작 (포트 3003)

### deploy-dev.sh (개발)

- Node.js/NPM 버전 확인
- 의존성 설치 (`npm ci`)
- 애플리케이션 빌드 (`npm run build`)
- 기존 PM2 프로세스 중지
- 새 프로세스 시작 (포트 3004)

## PM2 명령어

## 테스트

### 프로세스 상태 확인

```bash
pm2 status
```

### 로그 확인

```bash
# 전체 로그
pm2 logs

# 특정 앱 로그
pm2 logs the-wedding-lab        # 프로덕션
pm2 logs the-wedding-lab-dev    # 개발
```

### 프로세스 중지/재시작

```bash
# 중지
pm2 stop the-wedding-lab
pm2 stop the-wedding-lab-dev

# 재시작
pm2 restart the-wedding-lab
pm2 restart the-wedding-lab-dev

# 삭제
pm2 delete the-wedding-lab
pm2 delete the-wedding-lab-dev
```

## 포트 정보

- **프로덕션 (main)**: http://localhost:3003
- **개발 (develop)**: http://localhost:3004

## 트러블슈팅

### 1. SSH 연결 오류

```bash
# SSH 연결 테스트
ssh -i ~/.ssh/id_rsa username@server_ip

# SSH 키 권한 확인
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

### 2. 포트 충돌 시

```bash
# 포트 사용 중인 프로세스 확인
netstat -tulpn | grep :3003
netstat -tulpn | grep :3004

# 프로세스 종료
kill -9 PID
```

### 3. PM2 프로세스 초기화

```bash
pm2 kill
pm2 resurrect
```

### 4. 빌드 오류 시

```bash
# 캐시 삭제
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

## 배포 플로우

1. 코드 변경 후 GitHub에 push / pr
2. GitHub Actions가 자동으로 트리거됨
3. SSH로 서버에 접속
4. 최신 코드 pull
5. 해당 브랜치의 배포 스크립트 실행
6. PM2로 애플리케이션 재시작
7. 배포 완료 확인
