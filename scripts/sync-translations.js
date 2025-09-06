#!/usr/bin/env node

/**
 * Sync script for translation files
 * 
 * This script adds missing keys from the source language file to all other
 * language files, with default empty string values.
 * 
 * Usage:
 *   node sync-translations.js --dir <translations-directory> --source <source-language>
 * 
 * Example:
 *   node sync-translations.js --dir ./translations --source en
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
let isTypeScript = false;

if (fs.existsSync(sourceFileTsPath)) {
  sourceFilePath = sourceFileTsPath;
  isTypeScript = true;
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

// Extract the object name and content from the source file
let sourceObjectName = 'translations';
let sourceTranslations;
try {
  // Try different patterns to extract the object
  let objectMatch;
  
  // Pattern 1: export const translations = {...}
  const exportConstMatch = sourceContent.match(/export\s+const\s+(\w+)\s*=\s*({[\s\S]*?});/);
  
  // Pattern 2: export default {...}
  const exportDefaultMatch = sourceContent.match(/export\s+default\s+({[\s\S]*?});/);
  
  // Pattern 3: const translations = {...}; module.exports = translations
  const moduleExportsMatch = sourceContent.match(/const\s+(\w+)\s*=\s*({[\s\S]*?});/);
  
  // Pattern 4: module.exports = {...}
  const directExportMatch = sourceContent.match(/module\.exports\s*=\s*({[\s\S]*?});/);
  
  if (exportConstMatch) {
    sourceObjectName = exportConstMatch[1];
    objectMatch = exportConstMatch[2];
  } else if (exportDefaultMatch) {
    objectMatch = exportDefaultMatch[1];
  } else if (moduleExportsMatch) {
    sourceObjectName = moduleExportsMatch[1];
    objectMatch = moduleExportsMatch[2];
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

// Function to get a nested value from an object using a dot-notation path
function getNestedValue(obj, path) {
  const keys = path.split('.');
  return keys.reduce((o, key) => (o && o[key] !== undefined) ? o[key] : undefined, obj);
}

// Function to set a nested value in an object using a dot-notation path
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const lastObj = keys.reduce((o, key) => {
    if (o[key] === undefined) {
      o[key] = {};
    }
    return o[key];
  }, obj);
  
  lastObj[lastKey] = value;
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

// Sync each language file with the source language file
let syncedFiles = 0;
languageFiles.forEach(langFile => {
  const langFilePath = path.join(translationsDir, langFile);
  let langContent;
  let langObjectName = 'translations';
  let isLangTypeScript = langFile.endsWith('.ts');
  
  try {
    langContent = fs.readFileSync(langFilePath, 'utf8');
  } catch (error) {
    console.error(`Error reading language file ${langFile}: ${error.message}`);
    return;
  }
  
  // Extract the object name and content from the language file
  let langTranslations;
  try {
    // Try different patterns to extract the object
    let objectMatch;
    
    // Pattern 1: export const translations = {...}
    const exportConstMatch = langContent.match(/export\s+const\s+(\w+)\s*=\s*({[\s\S]*?});/);
    
    // Pattern 2: export default {...}
    const exportDefaultMatch = langContent.match(/export\s+default\s+({[\s\S]*?});/);
    
    // Pattern 3: const translations = {...}; module.exports = translations
    const moduleExportsMatch = langContent.match(/const\s+(\w+)\s*=\s*({[\s\S]*?});/);
    
    // Pattern 4: module.exports = {...}
    const directExportMatch = langContent.match(/module\.exports\s*=\s*({[\s\S]*?});/);
    
    if (exportConstMatch) {
      langObjectName = exportConstMatch[1];
      objectMatch = exportConstMatch[2];
    } else if (exportDefaultMatch) {
      objectMatch = exportDefaultMatch[1];
    } else if (moduleExportsMatch) {
      langObjectName = moduleExportsMatch[1];
      objectMatch = moduleExportsMatch[2];
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
    // Add missing keys to the language file
    missingKeys.forEach(key => {
      const sourceValue = getNestedValue(sourceTranslations, key);
      // Set empty string as default value for missing keys
      setNestedValue(langTranslations, key, typeof sourceValue === 'string' ? '' : {});
    });
    
    // Generate the updated file content
    let updatedContent;
    if (isLangTypeScript) {
      updatedContent = `export const ${langObjectName} = ${JSON.stringify(langTranslations, null, 2)};\n\nexport default ${langObjectName};\n`;
    } else {
      updatedContent = `const ${langObjectName} = ${JSON.stringify(langTranslations, null, 2)};\n\nmodule.exports = ${langObjectName};\n`;
    }
    
    // Write the updated language file
    try {
      fs.writeFileSync(langFilePath, updatedContent, 'utf8');
      console.log(`✅ Updated ${langFile} with ${missingKeys.length} missing keys.`);
      syncedFiles++;
    } catch (error) {
      console.error(`Error writing language file ${langFile}: ${error.message}`);
    }
  }
});

// Output the sync results
if (syncedFiles > 0) {
  console.log(`\n✅ Successfully synced ${syncedFiles} language files.`);
} else {
  console.log('✅ All translation files are already in sync with the source language.');
}