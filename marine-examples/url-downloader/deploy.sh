#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

# build wasms
./build.sh

(

 aqua remote deploy_service \
       --addr /dns4/kras-05.fluence.dev/tcp/19001/wss/p2p/12D3KooWCMr9mU894i8JXAFqpgoFtx6qnV1LFPSfVc3Y34N4h4LS \
       --config-path deployment_cfg.json \
       --service url-downloader
)
