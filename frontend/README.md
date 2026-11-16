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
