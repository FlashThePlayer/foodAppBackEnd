#!/bin/bash

env=$1

if [[ -z "$1" ]];
then
  env='dev';
else
  env=$1
fi

#set env if given which is default should be dev
export MONGO_USER=foodAppUser
export MONGO_PASS=secret
export NODE_ENV=${env}
export EXPRESS_PORT=3000
export AUTH_TOKEN_SEC="dockerStage_!_456"
export MONGO_URI="mongodb://foodAppUser:secret@database:27017/foodApp?authSource=admin"

docker-compose build
docker-compose up
