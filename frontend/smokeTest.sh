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
  echo "Smoke test passed for $SITE"
}

# Prints the error and stops; the ::error:: prefix shows up as an annotation in GitHub Actions.
fail() {
  echo "::error::Smoke test: $1" >&2
  exit 1
}

# Prints one response header's value, or nothing when it's missing.
header() {
  curl -sSfI "$1" | tr -d '\r' | awk -v name="$2:" 'tolower($1) == name { sub(/^[^:]*: */, ""); print }'
}

# The served index.html must be byte for byte the one just built, so a stale CDN or failed release shows up.
check_live_is_this_build() {
  curl -sSf "$SITE/" | cmp -s - "$DIST/index.html" || fail "$SITE/ doesn't serve $DIST/index.html, so the new release isn't live."
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

main
