#!/usr/bin/env bash
# Copy report.css and report.js into a website repo so they are served at
# <site>/tools/ (for this kit: https://alfonsograziano.it/tools/). It only
# copies and shows the diff. Committing and pushing (which deploys the site)
# stays a human step.
#
#   bash publish-kit.sh <path-to-site-repo>
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
site="${1:?usage: bash publish-kit.sh <path-to-site-repo>}"
site="$(cd "$site" && pwd)"
mkdir -p "$site/public/tools"
cp "$here/../assets/report.css" "$site/public/tools/report.css"
cp "$here/../assets/report.js" "$site/public/tools/report.js"
echo "Copied into $site/public/tools/"
git -C "$site" status --short public/tools
echo
echo "To deploy: commit and push the site repo (ask the site owner first)."
