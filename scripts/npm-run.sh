#!/bin/sh
# This acts as a workaround to avoid node error "stdout is not a tty" in bash for Windows
# see: https://stackoverflow.com/a/45112890/1922558
npm "$@"
exit $?