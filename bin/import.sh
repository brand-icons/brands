#!/bin/bash

cd bin

# Create dist directory
npx rimraf ../icons
mkdir ../icons

npx babel-node import-figma.js

cd ..
