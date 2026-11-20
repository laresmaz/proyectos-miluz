#!/usr/bin/env bash
# Photo pipeline: turns each original in photos-originals/ into the three WebP widths BrandPhoto serves.
set -euo pipefail

SOURCE_DIR="photos-originals"
OUT_DIR="public/photos"
WIDTHS=(480 960 1600)
QUALITY=50

# Converts every original, checking each file it writes
main() {
  if ! command -v magick >/dev/null; then
    echo "ImageMagick is missing. Run: nix shell nixpkgs#imagemagick -c ./photos.sh" >&2
    exit 1
  fi
  # The folders are relative to frontend/, wherever the script is run from.
  cd "$(dirname "$0")"
  shopt -s nullglob nocaseglob
  local originals=("$SOURCE_DIR"/*.{jpg,jpeg,png,heic,webp})
  if ((${#originals[@]} == 0)); then
    echo "No photos in $SOURCE_DIR/. Add one named after its use, like hero.jpg or proyecto-1-antes.jpg." >&2
    exit 1
  fi
  check_unique_names "${originals[@]}"
  mkdir -p "$OUT_DIR"
  for original in "${originals[@]}"; do
    convert_photo "$original"
  done
}

# Stops if two originals share a name (hero.jpg and hero.png), since both would write the same copies
check_unique_names() {
  local duplicates
  duplicates=$(for original in "$@"; do basename "${original%.*}"; done | sort -f | uniq -di)
  if [[ -n $duplicates ]]; then
    echo "Two originals share a name, so one would overwrite the other's copies: $duplicates. Rename or remove one." >&2
    exit 1
  fi
}

# Writes one original at each width, cropped from the centre and never enlarged
convert_photo() {
  local original=$1 name aspect
  name=$(basename "${original%.*}")
  # Before/after pairs show as squares on the project cards; everything else is 4:3.
  if [[ $name == *-antes || $name == *-despues ]]; then aspect="1:1"; else aspect="4:3"; fi
  for width in "${WIDTHS[@]}"; do
    local out="$OUT_DIR/$name-$width.webp"
    magick "$original" -auto-orient -strip -gravity center -crop "$aspect" +repage \
      -resize "${width}x>" -quality "$QUALITY" -define webp:method=6 "$out"
    check_output "$out" "$width" "$aspect"
  done
}

# Fails if a file came out wider than asked or lost its shape, then reports its size
check_output() {
  local out=$1 width=$2 aspect=$3 w h size
  read -r w h size < <(magick identify -format "%w %h %b\n" "$out")
  local ratio_w=${aspect%:*} ratio_h=${aspect#*:}
  # One pixel of rounding either way is fine.
  if ((w > width || w * ratio_h - h * ratio_w > ratio_h || h * ratio_w - w * ratio_h > ratio_w)); then
    echo "Check failed: $out is ${w}x${h}, expected at most $width wide at $aspect." >&2
    exit 1
  fi
  echo "$out  ${w}x${h}  $size"
}

main "$@"
