FROM node:25-bookworm

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    git \
    ca-certificates \
    curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces
