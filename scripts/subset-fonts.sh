#!/usr/bin/env bash
# Regenerates the subsetted Iosevka woff2 files in app/fonts/.
# The upstream Fontsource "latin" files are ~1 MB per weight, so we keep only
# Latin, Latin-1, general punctuation and arrows, plus only the default
# OpenType features: Iosevka's character-variant tables alone triple the size.
# Requires npm and uv.
set -euo pipefail

FONTSOURCE_VERSION="5.3.0"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/app/fonts"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

UNICODES="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2199,U+2212,U+2215"

mkdir -p "$OUT"

fetch() {
  local pkg="$1"
  (cd "$TMP" && npm pack "@fontsource/$pkg@$FONTSOURCE_VERSION" --silent >/dev/null)
  mkdir -p "$TMP/$pkg"
  tar -xzf "$TMP"/fontsource-"$pkg"-"$FONTSOURCE_VERSION".tgz -C "$TMP/$pkg"
}

subset() {
  local pkg="$1" weight="$2"
  uvx --from "fonttools[woff]" pyftsubset \
    "$TMP/$pkg/package/files/$pkg-latin-$weight-normal.woff2" \
    --unicodes="$UNICODES" \
    --layout-features+=tnum \
    --flavor=woff2 \
    --output-file="$OUT/$pkg-$weight.woff2"
}

fetch iosevka

for w in 400 500; do subset iosevka "$w"; done

ls -lh "$OUT"
