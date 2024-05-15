#!/bin/bash 
set -e 
# REACT_APP_으로 시작하는 환경변수를 window._ENV 객체에 저장하는 env.js 파일 생성 
echo -n "" > ./build/env.js 
echo "window._ENV={" >> ./build/env.js 
for key in $(compgen -v | grep ^REACT_APP_); do 
  echo "$key:'${!key}'," >> ./build/env.js 
done 
echo "}" >> ./build/env.js 

# 앱 서버 시작 
exec serve -s build