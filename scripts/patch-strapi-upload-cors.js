const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../node_modules/@strapi/upload/dist/_chunks/index-DGBFKgxl.js'),
  path.join(__dirname, '../node_modules/@strapi/upload/dist/_chunks/index-CHxEceRJ.mjs'),
];

let changed = 0;
for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;

  const original = fs.readFileSync(filePath, 'utf8');
  let next = original.replace(/checkCrossOrigin:\s*false/g, 'checkCrossOrigin: true');

  // Ensure image element used by cropper loads with CORS mode,
  // otherwise canvas.toBlob() throws "Tainted canvases may not be exported".
  next = next.replace(
    /jsxRuntime\.jsx\("img", \{ ref, src: url, alt: name2, \.\.\.props \}\)/g,
    'jsxRuntime.jsx("img", { ref, src: url, alt: name2, crossOrigin: "anonymous", ...props })'
  );

  next = next.replace(
    /jsx\("img", \{ ref, src: url, alt: name2, \.\.\.props \}\)/g,
    'jsx("img", { ref, src: url, alt: name2, crossOrigin: "anonymous", ...props })'
  );

  if (next !== original) {
    fs.writeFileSync(filePath, next, 'utf8');
    changed += 1;
    console.log('[patch-strapi-upload-cors] patched:', filePath);
  }
}

if (changed === 0) {
  console.log('[patch-strapi-upload-cors] no changes needed');
}
