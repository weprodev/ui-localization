#!/usr/bin/env node

/**
 * Validation script for translation files
 * 
 * This script checks all language TS/JS files against the source language file
 * and outputs any missing keys per file.
 * 
 * Usage:
 *   node validate-translations.js --dir <translations-directory> --source <source-language>
 * 
 * Example:
 *   node validate-translations.js --dir ./translations --source en
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let translationsDir = './translations';
let sourceLanguage = 'en';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dir' && args[i + 1]) {
    translationsDir = args[i + 1];
  } else if (args[i] === '--source' && args[i + 1]) {
    sourceLanguage = args[i + 1];
  }
}

// Ensure the translations directory exists
if (!fs.existsSync(translationsDir)) {
  console.error(`Error: Translations directory '${translationsDir}' does not exist.`);
  process.exit(1);
}

// Check for source language file (both .ts and .js)
const sourceFileTsPath = path.join(translationsDir, `${sourceLanguage}.ts`);
const sourceFileJsPath = path.join(translationsDir, `${sourceLanguage}.js`);

let sourceFilePath;
if (fs.existsSync(sourceFileTsPath)) {
  sourceFilePath = sourceFileTsPath;
} else if (fs.existsSync(sourceFileJsPath)) {
  sourceFilePath = sourceFileJsPath;
} else {
  console.error(`Error: Source language file '${sourceLanguage}.ts' or '${sourceLanguage}.js' does not exist in ${translationsDir}.`);
  process.exit(1);
}

// Read and parse the source language file
let sourceContent;
try {
  sourceContent = fs.readFileSync(sourceFilePath, 'utf8');
} catch (error) {
  console.error(`Error reading source language file: ${error.message}`);
  process.exit(1);
}

// Extract the object from the source file
let sourceTranslations;
try {
  // Try different patterns to extract the object
  let objectMatch;
  
  // Pattern 1: export const translations = {...}
  const exportConstMatch = sourceContent.match(/export\s+const\s+\w+\s*=\s*({[\s\S]*?});/);
  
  // Pattern 2: export default {...}
  const exportDefaultMatch = sourceContent.match(/export\s+default\s+({[\s\S]*?});/);
  
  // Pattern 3: const translations = {...}; module.exports = translations
  const moduleExportsMatch = sourceContent.match(/const\s+\w+\s*=\s*({[\s\S]*?});/);
  
  // Pattern 4: module.exports = {...}
  const directExportMatch = sourceContent.match(/module\.exports\s*=\s*({[\s\S]*?});/);
  
  if (exportConstMatch) {
    objectMatch = exportConstMatch[1];
  } else if (exportDefaultMatch) {
    objectMatch = exportDefaultMatch[1];
  } else if (moduleExportsMatch) {
    objectMatch = moduleExportsMatch[1];
  } else if (directExportMatch) {
    objectMatch = directExportMatch[1];
  } else {
    throw new Error('Could not find translation object in source file');
  }
  
  // Evaluate the object (safer than using eval)
  const objectCode = `return ${objectMatch}`;
  const objectFn = new Function(objectCode);
  sourceTranslations = objectFn();
} catch (error) {
  console.error(`Error parsing source language file: ${error.message}`);
  process.exit(1);
}

// Function to extract all keys from a nested object
function extractKeys(obj, prefix = '') {
  let keys = [];
  
  for (const key in obj) {
    const currentKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recursively extract keys from nested objects
      keys = [...keys, ...extractKeys(obj[key], currentKey)];
    } else {
      keys.push(currentKey);
    }
  }
  
  return keys;
}

// Get all keys from the source language file
const sourceKeys = extractKeys(sourceTranslations);

// Get all language files in the directory
const languageFiles = fs.readdirSync(translationsDir)
  .filter(file => (file.endsWith('.ts') || file.endsWith('.js')) && 
                  file !== `${sourceLanguage}.ts` && 
                  file !== `${sourceLanguage}.js`);

// Check each language file for missing keys
let hasMissingKeys = false;
const missingKeysReport = {};

languageFiles.forEach(langFile => {
  const langFilePath = path.join(translationsDir, langFile);
  let langContent;
  
  try {
    langContent = fs.readFileSync(langFilePath, 'utf8');
  } catch (error) {
    console.error(`Error reading language file ${langFile}: ${error.message}`);
    return;
  }
  
  // Extract the object from the language file
  let langTranslations;
  try {
    // Try different patterns to extract the object
    let objectMatch;
    
    // Pattern 1: export const translations = {...}
    const exportConstMatch = langContent.match(/export\s+const\s+\w+\s*=\s*({[\s\S]*?});/);
    
    // Pattern 2: export default {...}
    const exportDefaultMatch = langContent.match(/export\s+default\s+({[\s\S]*?});/);
    
    // Pattern 3: const translations = {...}; module.exports = translations
    const moduleExportsMatch = langContent.match(/const\s+\w+\s*=\s*({[\s\S]*?});/);
    
    // Pattern 4: module.exports = {...}
    const directExportMatch = langContent.match(/module\.exports\s*=\s*({[\s\S]*?});/);
    
    if (exportConstMatch) {
      objectMatch = exportConstMatch[1];
    } else if (exportDefaultMatch) {
      objectMatch = exportDefaultMatch[1];
    } else if (moduleExportsMatch) {
      objectMatch = moduleExportsMatch[1];
    } else if (directExportMatch) {
      objectMatch = directExportMatch[1];
    } else {
      throw new Error('Could not find translation object in language file');
    }
    
    // Evaluate the object (safer than using eval)
    const objectCode = `return ${objectMatch}`;
    const objectFn = new Function(objectCode);
    langTranslations = objectFn();
  } catch (error) {
    console.error(`Error parsing language file ${langFile}: ${error.message}`);
    return;
  }
  
  const langKeys = extractKeys(langTranslations);
  const missingKeys = sourceKeys.filter(key => !langKeys.includes(key));
  
  if (missingKeys.length > 0) {
    hasMissingKeys = true;
    missingKeysReport[langFile] = missingKeys;
  }
});

// Output the validation results
if (hasMissingKeys) {
  console.log('\n❌ Missing translation keys found:');
  
  for (const langFile in missingKeysReport) {
    const missingKeys = missingKeysReport[langFile];
    console.log(`\n${langFile} (${missingKeys.length} missing keys):`);
    missingKeys.forEach(key => console.log(`  - ${key}`));
  }
  
  process.exit(1);
} else {
  console.log('✅ All translation files are in sync with the source language.');
  process.exit(0);
}