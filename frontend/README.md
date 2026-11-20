# Frontend

Teaser page for the engineering and renovation site, built with React, TypeScript, Vite and Tailwind.

```sh
pnpm install
pnpm dev      # local dev server
pnpm build    # static files in dist/, ready to upload to Bunny
```

Icons in `public/` are generated from the SVGs with ImageMagick; rerun after changing the logo:

```sh
magick -background none -density 384 public/favicon.svg -resize 32x32 public/favicon-32.png
magick -size 180x180 xc:'#05054A' \( -background none -density 768 src/assets/logo.svg -resize 144x144 \) -gravity center -composite public/apple-touch-icon.png
magick -size 512x512 xc:'#05054A' \( -background none -density 1536 src/assets/logo.svg -resize 320x320 \) -gravity center -composite public/icon-512.png
```

Photos: put each original in `photos-originals/` (gitignored), named after its use, like `hero.jpg` or `proyecto-1-antes.jpg`. Names ending in `-antes` or `-despues` are cropped square, the rest 4:3. The script writes the 480, 960 and 1600 px WebP copies that `BrandPhoto` serves into `public/photos/`; commit those:

```sh
nix shell nixpkgs#imagemagick -c ./photos.sh
```
