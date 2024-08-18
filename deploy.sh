#!/bin/bash
echo 'restart deploy'
# shellcheck disable=SC2145   shell
ssh root@$1 "/usr/local/bin/restart_docker_qrobot_web $@"
