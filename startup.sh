#!/bin/bash

env=$1

if [[ -z "$1" ]];
then
  env='dev';
else
  env=$1
fi

mongo_user='timu'
mongo_pass='random'
mongo_database='foodApp'
node_env=${env}
express_port=3000
mongo_url='database:27071'

docker-compose up
