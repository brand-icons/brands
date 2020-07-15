#!/bin/bash

cd bin

# Export SVG icons to S3
npx babel-node export-svgs.js

# Invalidate Cloudfront cache
npx babel-node invalidate-cache.js

cd ..
