// SEO Checker Script
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Starting SEO Check for Jay\'s Frames...');

// Define paths to check
const clientDir = path.join(__dirname, 'client');
const publicDir = path.join(clientDir, 'public');
const srcDir = path.join(clientDir, 'src');
const pagesDir = path.join(srcDir, 'pages');

// Check for essential SEO files
console.log('\n📂 Checking Essential SEO Files:');
const essentialFiles = [
  { path: path.join(publicDir, 'robots.txt'), name: 'robots.txt' },
  { path: path.join(publicDir, 'sitemap.xml'), name: 'sitemap.xml' },
];

essentialFiles.forEach(file => {
  if (fs.existsSync(file.path)) {
    console.log(`✅ ${file.name} exists`);
  } else {
    console.log(`❌ ${file.name} is missing`);
  }
});

// Check for 404 page
console.log('\n🔍 Checking 404 Page:');
const notFoundPath = path.join(pagesDir, 'not-found.tsx');
if (fs.existsSync(notFoundPath)) {
  console.log('✅ 404 page exists');
} else {
  console.log('❌ 404 page is missing');
}

// Check meta tags in index.html
console.log('\n📝 Checking Meta Tags in index.html:');
const indexHtmlPath = path.join(publicDir, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  
  const metaTags = {
    description: /<meta\s+name=["']description["']\s+content=["'](.+?)["']/i.test(indexHtml),
    viewport: /<meta\s+name=["']viewport["']\s+content=["'](.+?)["']/i.test(indexHtml),
    robots: /<meta\s+name=["']robots["']\s+content=["'](.+?)["']/i.test(indexHtml),
    ogTitle: /<meta\s+property=["']og:title["']\s+content=["'](.+?)["']/i.test(indexHtml),
    ogDescription: /<meta\s+property=["']og:description["']\s+content=["'](.+?)["']/i.test(indexHtml),
    ogImage: /<meta\s+property=["']og:image["']\s+content=["'](.+?)["']/i.test(indexHtml),
    twitterCard: /<meta\s+name=["']twitter:card["']\s+content=["'](.+?)["']/i.test(indexHtml),
  };
  
  Object.entries(metaTags).forEach(([tag, exists]) => {
    console.log(`${exists ? '✅' : '❌'} ${tag}`);
  });
} else {
  console.log('❌ index.html is missing');
}

// Check page components for SEO elements
console.log('\n🔍 Checking Page Components for SEO Elements:');

// Function to check pages for h1 tags and meta information
function checkPagesForSEO() {
  if (!fs.existsSync(pagesDir)) {
    console.log('❌ Pages directory not found');
    return;
  }
  
  const pageFiles = fs.readdirSync(pagesDir)
    .filter(file => file.endsWith('.tsx') && !file.includes('.test.') && !file.includes('.spec.'));
  
  let pagesWithH1 = 0;
  let pagesWithHelmet = 0;
  let pagesWithMeta = 0;
  
  pageFiles.forEach(file => {
    const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
    
    // Check for h1 tags
    if (/<h1[^>]*>|className="[^"]*\btext-[234]?xl\b[^"]*"|text-[234]?xl/.test(content)) {
      pagesWithH1++;
    }
    
    // Check for React Helmet
    if (/import.*Helmet.*from 'react-helmet'|import.*Helmet.*from "react-helmet"|<Helmet>/.test(content)) {
      pagesWithHelmet++;
    }
    
    // Check for meta tags
    if (/<meta|<title>/.test(content)) {
      pagesWithMeta++;
    }
  });
  
  console.log(`📊 Pages with H1 or large heading: ${pagesWithH1}/${pageFiles.length}`);
  console.log(`📊 Pages with React Helmet: ${pagesWithHelmet}/${pageFiles.length}`);
  console.log(`📊 Pages with meta tags: ${pagesWithMeta}/${pageFiles.length}`);
}

checkPagesForSEO();

// Check for image optimization
console.log('\n🖼️ Checking Image Optimization:');
function checkImageOptimization() {
  const imgDir = path.join(publicDir, 'img');
  if (!fs.existsSync(imgDir)) {
    console.log('❓ No dedicated img directory found. Check image handling in the app');
    return;
  }
  
  const imageFiles = fs.readdirSync(imgDir)
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
  
  let imagesWithAlt = 0;
  let imagesWithLazyLoading = 0;
  
  // Check src files for image usage with alt text and lazy loading
  const srcFiles = [];
  function getAllFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getAllFiles(filePath);
      } else if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
        srcFiles.push(filePath);
      }
    });
  }
  
  getAllFiles(srcDir);
  
  srcFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for alt text in images
    if (/<img[^>]*alt=["'][^"']+["'][^>]*>/.test(content)) {
      imagesWithAlt++;
    }
    
    // Check for lazy loading
    if (/<img[^>]*loading=["']lazy["'][^>]*>/.test(content)) {
      imagesWithLazyLoading++;
    }
  });
  
  console.log(`📊 Component files with image alt text: ${imagesWithAlt}/${srcFiles.length}`);
  console.log(`📊 Component files with lazy loading: ${imagesWithLazyLoading}/${srcFiles.length}`);
}

checkImageOptimization();

// Check for performance optimization
console.log('\n⚡ Checking Performance Optimization:');

// Check for compression middleware
function checkCompressionMiddleware() {
  const serverFiles = ['server/index.ts', 'server/vite.ts', 'server.js', 'index.js']
    .map(file => path.join(__dirname, file));
  
  let hasCompressionMiddleware = false;
  
  serverFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (/compression|app\.use\(\s*compression/i.test(content)) {
        hasCompressionMiddleware = true;
      }
    }
  });
  
  console.log(`${hasCompressionMiddleware ? '✅' : '❌'} Compression middleware`);
}

checkCompressionMiddleware();

// Check for local business schema
console.log('\n🏪 Checking Local Business Schema:');
function checkLocalBusinessSchema() {
  const srcFiles = [];
  function getAllFiles(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getAllFiles(filePath);
      } else if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
        srcFiles.push(filePath);
      }
    });
  }
  
  getAllFiles(srcDir);
  getAllFiles(publicDir);
  
  let hasLocalBusinessSchema = false;
  
  srcFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (/@type['"]\s*:\s*['"]\s*LocalBusiness\s*['"]|\{"@context":\s*"https:\/\/schema.org"/.test(content)) {
      hasLocalBusinessSchema = true;
    }
  });
  
  console.log(`${hasLocalBusinessSchema ? '✅' : '❌'} LocalBusiness Schema`);
}

checkLocalBusinessSchema();

// Check for mobile responsiveness
console.log('\n📱 Checking Mobile Responsiveness:');
function checkMobileResponsiveness() {
  // Check for media queries in CSS
  const cssFiles = [];
  function getAllCssFiles(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getAllCssFiles(filePath);
      } else if (filePath.endsWith('.css')) {
        cssFiles.push(filePath);
      }
    });
  }
  
  getAllCssFiles(srcDir);
  
  let hasMediaQueries = false;
  
  // Also check main.css directly
  const mainCssPath = path.join(srcDir, 'main.css');
  if (fs.existsSync(mainCssPath)) {
    const content = fs.readFileSync(mainCssPath, 'utf8');
    if (/@media\s+/.test(content)) {
      hasMediaQueries = true;
      console.log('✅ Media queries found in main.css');
    }
  }
  
  cssFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (/@media\s*\(/.test(content)) {
      hasMediaQueries = true;
    }
  });
  
  // Check for responsive classes in components
  const componentFiles = [];
  function getAllComponentFiles(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getAllComponentFiles(filePath);
      } else if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
        componentFiles.push(filePath);
      }
    });
  }
  
  getAllComponentFiles(path.join(srcDir, 'components'));
  
  let hasResponsiveClasses = false;
  
  componentFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (/className="[^"]*\b(sm:|md:|lg:|xl:)\b[^"]*"/.test(content)) {
      hasResponsiveClasses = true;
    }
  });
  
  console.log(`${hasMediaQueries ? '✅' : '❌'} Media queries in CSS`);
  console.log(`${hasResponsiveClasses ? '✅' : '❌'} Responsive classes in components`);
  
  // Check for viewport meta tag
  const indexHtmlPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    const hasViewportMeta = /<meta\s+name=["']viewport["']\s+content=["'](.+?)["']/i.test(indexHtml);
    console.log(`${hasViewportMeta ? '✅' : '❌'} Viewport meta tag`);
  } else {
    console.log('❌ index.html is missing, cannot check viewport meta tag');
  }
}

checkMobileResponsiveness();

// Check for local SEO indicators
console.log('\n📍 Checking Local SEO Indicators:');
function checkLocalSEO() {
  const srcFiles = [];
  function getAllFiles(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getAllFiles(filePath);
      } else if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
        srcFiles.push(filePath);
      }
    });
  }
  
  getAllFiles(srcDir);
  
  let hasHouston = false;
  let hasTexas = false;
  let hasAddress = false;
  let hasPhone = false;
  
  srcFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (/\bHouston\b/i.test(content)) {
      hasHouston = true;
    }
    if (/\bTexas\b|\bTX\b/i.test(content)) {
      hasTexas = true;
    }
    if (/\d+\s+[\w\s]+St\.?|Street|Road|Avenue|Ave\.?|Blvd\.?|Boulevard|Lane|Ln\.?|Drive|Dr\.?/i.test(content)) {
      hasAddress = true;
    }
    if (/\(\d{3}\)\s*\d{3}-\d{4}|\d{3}-\d{3}-\d{4}/i.test(content)) {
      hasPhone = true;
    }
  });
  
  console.log(`${hasHouston ? '✅' : '❌'} References to Houston`);
  console.log(`${hasTexas ? '✅' : '❌'} References to Texas/TX`);
  console.log(`${hasAddress ? '✅' : '❌'} Business address`);
  console.log(`${hasPhone ? '✅' : '❌'} Business phone number`);
}

checkLocalSEO();

console.log('\n✨ SEO Check Completed');