#!/bin/bash
if ! hash verdaccio &> /dev/null; then
    echo "Verdaccio is not installed globally";
    exit 1;
fi

if [ -n "$1" ]; then
    echo "Requested, real deploy";
    echo "press ctrl+c to cancel, or any other key to continue";
    read unused;
    fake=""
else
    echo "Will deploy to Verdaccio";
    fake=true
    verdaccioUrl='http://127.0.0.1:4873';
    oldRegistry=`npm get registry`;
    npm set registry $verdaccioUrl;
fi

originalPath="$PWD";
for module in `find ../modules -maxdepth 1 -type d`; do
    if [ -f "$module/package.json" ]; then
        _moduleName=`basename $module`;
        echo "Publishing module $_moduleName to verdaccio";
        cd "$module";
        test -n "$fake" && npm unpublish --force &> /dev/null;
        npm publish;
        if [ $? != "0" ]; then
            echo "Module $_moduleName publish failed =/";
            exit 1;
        fi
        cd "$originalPath";
    fi
done
test -n "$fake" && npm set registry "$oldRegistry";