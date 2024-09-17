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

if ! cd "$SCRIPT_DIR/frontend"; then
    log_error "Failed to change directory"
    exit 1
fi
log_info "Installing frontend dependencies..."
if ! npm install --include=dev; then
    log_error "Failed to install frontend dependencies"
    exit 1
fi
log_info "Building frontend..."
if ! npm run build; then
    log_error "Failed to build frontend"
    exit 1
fi

if ! cd "$SCRIPT_DIR"; then
    log_error "Failed to change directory to $SCRIPT_DIR"
    exit 1
fi

# delete if exist backend/public and copy frontend build to backend/public
if [ -d "backend/public" ]; then
    log_info "Deleting existing backend/public directory..."
    if ! rm -rf backend/public; then
        log_error "Failed to delete backend/public directory"
        exit 1
    fi
fi
log_info "Creating backend/public directory..."
if ! mkdir -p backend/public; then
    log_error "Failed to create backend/public directory"
    exit 1
fi
log_info "Copying frontend build to backend/public..."
if ! cp -r frontend/out/* backend/public; then
    log_error "Failed to copy frontend build to backend/public"
    exit 1
fi

if ! cd "$SCRIPT_DIR/backend"; then
    log_error "Failed to change directory to $SCRIPT_DIR/backend"
    exit 1
fi
log_info "Installing backend dependencies..."
if ! npm install --include=dev; then
    log_error "Failed to install backend dependencies"
    exit 1
fi

log_success "Build completed successfully!"
