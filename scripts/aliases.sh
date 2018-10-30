# Source this file to have functions useful when developing Lollipop modules
# You can source this file in your bash_profile to have functions always available

function lollipop-reinstall-cli () {
    npm uninstall -g @ts-lollipop/cli;
    npm install -g @ts-lollipop/cli;
}