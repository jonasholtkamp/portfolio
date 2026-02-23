#!/usr/bin/env bash
# Run Lighthouse 2x2 matrix (desktop/mobile × light/dark)
# Usage: ./scripts/lighthouse.sh [url]
# Default URL: http://localhost:4321

set -euo pipefail

URL="${1:-http://localhost:4321}"
CHROME_PATH="${CHROME_PATH:-/Applications/Brave Browser.app/Contents/MacOS/Brave Browser}"

parse='const d=JSON.parse(require("fs").readFileSync("/dev/stdin","utf8"));const c=d.categories;const label=process.env.LABEL;console.log(label,"— Performance:",Math.round(c.performance.score*100),"Accessibility:",Math.round(c.accessibility.score*100),"Best Practices:",Math.round(c["best-practices"].score*100),"SEO:",Math.round(c.seo.score*100))'

run() {
  local label="$1" scheme="$2" preset="${3:---preset=desktop}"
  LABEL="$label" CHROME_PATH="$CHROME_PATH" npx lighthouse "$URL" \
    --output=json --quiet \
    --chrome-flags="--headless --force-prefers-color-scheme=$scheme" \
    $preset 2>/dev/null | node -e "$parse"
}

echo "Target: $URL"
echo ""
run "Desktop Light" light --preset=desktop
run "Desktop Dark " dark  --preset=desktop
run "Mobile  Light" light ""
run "Mobile  Dark " dark  ""
