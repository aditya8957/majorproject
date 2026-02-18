// Script to convert all TSX files to JSX
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all TSX files
function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to convert a TSX file to JSX
function convertTsxToJsx(tsxPath) {
  const jsxPath = tsxPath.replace('.tsx', '.jsx');
  
  // Skip if JSX file already exists
  if (fs.existsSync(jsxPath)) {
    console.log(`Skipping ${tsxPath} - JSX file already exists`);
    return;
  }
  
  // Read the TSX file
  let content = fs.readFileSync(tsxPath, 'utf8');
  
  // Remove TypeScript types
  content = content
    // Remove type imports
    .replace(/import\s+type\s+.*?;\n/g, '')
    // Remove interface and type declarations
    .replace(/\binterface\s+\w+\s*\{[^}]*\}\s*/g, '')
    .replace(/\btype\s+\w+\s*=\s*[^;]*;\s*/g, '')
    // Remove type annotations from function parameters
    .replace(/:\s*\w+(?:\s*\|\s*\w+)*\s*(?=,|\))/g, '')
    // Remove type annotations from variables
    .replace(/:\s*\w+(?:\s*\|\s*\w+)*\s*(?==)/g, '')
    // Remove React.FC type
    .replace(/:\s*React\.FC(?:<[^>]*>)?/g, '')
    // Remove generic type parameters
    .replace(/<[^>]*>/g, '')
    // Remove ReactNode type
    .replace(/:\s*ReactNode/g, '');
  
  // Write the JSX file
  fs.writeFileSync(jsxPath, content);
  console.log(`Converted ${tsxPath} to ${jsxPath}`);
}

// Main function
function main() {
  const srcDir = path.join(__dirname, 'src');
  const tsxFiles = findTsxFiles(srcDir);
  
  console.log(`Found ${tsxFiles.length} TSX files to convert`);
  
  // Convert each TSX file to JSX
  tsxFiles.forEach(tsxFile => {
    convertTsxToJsx(tsxFile);
  });
  
  console.log('Conversion complete!');
}

main();