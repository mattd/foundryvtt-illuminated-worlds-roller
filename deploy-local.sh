#!/bin/bash
if [ -z "$1" ]; then
    exit 1
else
    TARGET_DIR="$1"
    ORIGIN_DIR=`pwd`
    npm run package
    mv build.zip $TARGET_DIR
    cd $TARGET_DIR
    unzip -o build.zip
    rm build.zip
    cd $ORIGIN_DIR
fi
