#!/usr/bin/env bash
# Smoke test for the live site: run by CD after a deploy, or by hand from frontend/ after `pnpm build`.
set -euo pipefail

SITE="${SITE:-https://www.proyectosmiluz.com}"
BARE="${BARE:-https://proyectosmiluz.com}"
DIST="${DIST:-dist}"

# Runs every check in order and stops at the first failure.
main() {
  check_live_is_this_build
  check_bare_redirects
  check_cache_headers
  check_security_headers
  check_unknown_page_is_404
  echo "Smoke test passed for $SITE"
}

# The served index.html must be byte for byte the one just built; retried because CDN edges can lag a release by seconds.
check_live_is_this_build() {
  local try
  for try in 1 2 3 4 5 6; do
    curl -sSf "$SITE/" | cmp -s - "$DIST/index.html" && return
    [ "$try" = 6 ] || sleep 10
  done
  fail "$SITE/ doesn't serve $DIST/index.html after a minute, so the new release isn't live."
}

# Prints the error and stops; the ::error:: prefix shows up as an annotation in GitHub Actions.
fail() {
  echo "::error::Smoke test: $1" >&2
  exit 1
}

# The bare domain must send visitors to www with a permanent redirect.
check_bare_redirects() {
  local got
  got=$(curl -sS -o /dev/null -w '%{http_code} %{redirect_url}' "$BARE/")
  [ "$got" = "301 $SITE/" ] || fail "$BARE/ answered '$got' instead of '301 $SITE/'."
}

# index.html must be revalidated on every visit, and hashed assets cached for good (firebase.json).
check_cache_headers() {
  local asset index_cache asset_cache
  asset=$(grep -oE '/assets/[^"]+' "$DIST/index.html" | head -n1) || true
  [ -n "$asset" ] || fail "no /assets/ file referenced in $DIST/index.html."
  index_cache=$(header "$SITE/" cache-control)
  asset_cache=$(header "$SITE$asset" cache-control)
  [[ "$index_cache" == *no-cache* ]] || fail "$SITE/ has Cache-Control '$index_cache', expected no-cache."
  [[ "$asset_cache" == *immutable* ]] || fail "$SITE$asset has Cache-Control '$asset_cache', expected immutable."
}

# Every response must forbid MIME sniffing and framing by other sites (firebase.json).
check_security_headers() {
  local nosniff frame
  nosniff=$(header "$SITE/" x-content-type-options)
  frame=$(header "$SITE/" content-security-policy)
  [ "$nosniff" = nosniff ] || fail "$SITE/ has X-Content-Type-Options '$nosniff', expected nosniff."
  [[ "$frame" == *"frame-ancestors 'none'"* ]] || fail "$SITE/ has Content-Security-Policy '$frame', expected frame-ancestors 'none'."
}

# An address the site doesn't have must answer 404, not the app with 200, so search engines drop it.
check_unknown_page_is_404() {
  local status
  status=$(curl -sS -o /dev/null -w '%{http_code}' "$SITE/no-such-page")
  [ "$status" = 404 ] || fail "$SITE/no-such-page answered $status instead of 404."
}

# Prints one response header's value, or nothing when it's missing; fails when the URL doesn't answer 2xx.
header() {
  curl -sSfI "$1" | tr -d '\r' | awk -v name="$2:" 'tolower($1) == name { sub(/^[^:]*: */, ""); print }' ||
    fail "$1 didn't answer with a 2xx status."
}

main
