// Script to remove all TypeScript files after conversion
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all TS/TSX files
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      // Skip vite-env.d.ts and other declaration files
      if (!file.endsWith('.d.ts')) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// Main function
function main() {
  const srcDir = path.join(__dirname);
  const tsFiles = findTsFiles(srcDir);
  
  console.log(`Found ${tsFiles.length} TypeScript files to remove`);
  
  // Remove each TS/TSX file
  tsFiles.forEach(tsFile => {
    // Check if corresponding JS/JSX file exists
    const jsFile = tsFile.replace(/\.tsx?$/, match => match === '.ts' ? '.js' : '.jsx');
    
    if (fs.existsSync(jsFile)) {
      fs.unlinkSync(tsFile);
      console.log(`Removed ${tsFile}`);
    } else {
      console.log(`Skipping removal of ${tsFile} - no JS/JSX equivalent found`);
    }
  });
  
  // Remove TypeScript config files
  const configFiles = [
    path.join(__dirname, 'tsconfig.json'),
    path.join(__dirname, 'tsconfig.node.json')
  ];
  
  configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`Removed ${file}`);
    }
  });
  
  console.log('Removal complete!');
}

main();