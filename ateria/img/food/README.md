# Dish photos

Put one photo per recipe here, named after the recipe id (for example `d_meatballs.jpg`).
The ids are in `data/recipes.js`. Then run `node tools/photos_index.js` from the `ateria/` folder:
it updates `data/photos.js` and lists the recipes that still have no photo.

* JPEG, landscape (16:9 or 4:3), at least 640 px wide, at most 200 KB.
* Use only photos you took yourself, or photos whose licence allows this use (for example Unsplash, Pexels, or Wikimedia Commons public-domain / CC0 files).
  If a licence asks for a credit, add it to `credits.json` as `{ "d_meatballs": "Photographer, source, licence" }`; the app then shows it under the photo.
* A photo must show the dish the recipe makes. A recipe without a photo keeps the drawn ingredient pictures.
