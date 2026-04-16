const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/imports/WhyChoose.tsx',
  'src/imports/WhyChoose-2-414.tsx',
  'src/imports/WhyChoose-1-1741.tsx',
  'src/imports/SectionsFeaturedProperties.tsx',
  'src/imports/HeroContainer.tsx'
];

for (const relativePath of filesToFix) {
  const fullPath = path.join(__dirname, relativePath);
  if (!fs.existsSync(fullPath)) continue;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Find all <img ... src={variable} /> and replace with src={variable.src}
  // We'll use a regex that looks specifically for <img followed by anything then src={variable}
  // This is safe because these variables are all imported Next.js images.
  content = content.replace(/<(img\b[^>]*?)src=\{([a-zA-Z0-9_]+)\}/g, '<$1src={$2.src}');
  
  fs.writeFileSync(fullPath, content);
  console.log('Fixed', relativePath);
}
