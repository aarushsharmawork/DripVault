#!/bin/bash
set -e
cd "$(dirname "$0")"
echo "Starting Dripvault at http://localhost:5173/DripVault/"
npm run dev -- --host 127.0.0.1 --port 5173
