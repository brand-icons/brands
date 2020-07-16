#!/bin/bash

cd bin

# Process SVG files
npx babel-node optimize-svgs.js

# Create dist directory
npx rimraf ../dist
mkdir ../dist

# Build icons.json
npx babel-node build-json.js

# Build SVG sprite
npx babel-node build-sprites.js

# Create dist/icons directory
npx rimraf ../dist/icons
mkdir ../dist/icons

# Build SVG icons
npx babel-node build-svgs.js

cd ..

# Build JavaScript library
npx webpack --mode development
npx webpack --mode production
