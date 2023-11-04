#!/usr/bin/env bash

REPOSITORY=/home/ec2-user/EliceStudy2nd_BE/dist/batch

echo "> 배치 파일에 실행 권한 부여"

chmod +x ${REPOSITORY}/index.js

echo "> 배치 파일 실행"

node ${REPOSITORY}/index.js

exit 0
