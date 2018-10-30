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

function safeNpmRun () {
    ../../scripts/npm-run.sh "$@";
}

##
# @param string $1 package to test
##
function isVersionPublished () {
    _parsedModuleName="@ts-lollipop/$1";
    currentVersion=`safeNpmRun ls | grep "$_parsedModuleName" | cut -d ' ' -f 1 | cut -d '@' -f 3`;
    node ../../scripts/js/is-version-published.js "$_parsedModuleName" "$currentVersion";
    return $?;
}

originalPath="$PWD";
for module in `find ../modules -maxdepth 1 -type d`; do
    if [ -f "$module/package.json" ]; then
        _moduleName=`basename $module`;
        cd "$module";
        if ! isVersionPublished "$_moduleName"; then
            echo "Publishing module $_moduleName to verdaccio";  
            test -n "$fake" && npm unpublish --force &> /dev/null;
            npm publish --access public;
            if [ $? != "0" ]; then
                echo "Module $_moduleName publish failed =/";
                exit 1;
            fi
        else
            echo "Package $_moduleName already published";
        fi
        cd "$originalPath";
    fi
done
test -n "$fake" && npm set registry "$oldRegistry";