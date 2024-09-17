#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

log_info() {
    echo -e "\033[0;32m$1\033[0m"
}

log_error() {
    echo -e "\033[0;31m$1\033[0m"
}
log_success() {
    echo -e "\033[0;32m$1\033[0m"
}

if ! cd "$SCRIPT_DIR"; then
    log_error "Failed to change directory to $SCRIPT_DIR"
    exit 1
fi

# Build the frontend
log_info "Building frontend..."
if ! npm run build; then
    log_error "Failed to build frontend"
    exit 1
fi

