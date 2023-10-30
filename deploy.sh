#!/usr/bin/env bash

REPOSITORY=/home/ec2-user/EliceStudy2nd_BE

echo "> 배포 시작"

echo "> WAS가 동작하고 있는지 확인"

# 동작하고 있는지 확인
IS_RUNNING=$(ps aux | grep app.js)

echo "> 프로젝트 폴더로 이동"

cd ${REPOSITORY}

echo "> git pull"

git pull origin dev

echo "> npm 패키지 업데이트"

npm install

echo "> npm build"

npm build

echo "> 프로세스가 실행중이면 restart"

if [ -n $"IS_RUNNING" ] ; then
	pm2 restart ecosystem.config.js --only dev --env dev
fi

echo "> 아니라면 start"

if [ -z $"IS_RUNNING" ] ; then
	pm2 start ecosystem.config.js --only dev --env dev
fi

