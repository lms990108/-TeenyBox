#!/usr/bin/env bash

REPOSITORY=/home/ec2-user/EliceStudy2nd_BE

echo "> 배포 시작"

echo "> 프로젝트 폴더로 이동"

cd ${REPOSITORY}

echo "> git pull"

git pull origin dev

echo "> npm 패키지 업데이트"

npm install

echo "> npm build"

npm run build

echo "> WAS 실행 여부 확인"

# 동작하고 있는지 확인
IS_RUNNING=$(ps aux | grep app.js)

if [ -n $"IS_RUNNING" ] ; then
	echo "> WAS가 실행 중이면 restart"
	pm2 restart ecosystem.config.js --only dev --env dev
fi

if [ -z $"IS_RUNNING" ] ; then
	echo "> WAS가 꺼져 있다면 start"
	pm2 start ecosystem.config.js --only dev --env dev
fi

exit 0
