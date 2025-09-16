import { LanguageStore } from "../../core/types";

/**
 * Mock implementation of LanguageStore for testing
 */
export class MockLanguageStore implements LanguageStore {
  private language: string | null = null;

  getLanguage(): string | null {
    return this.language;
  }

  setLanguage(language: string): void {
    this.language = language;
  }
}

/**
 * Helper function to create translation resources for testing
 */
export const createTestResources = (languages: string[] = ['en', 'fr', 'es']) => {
  const resources: Record<string, Record<string, Record<string, string>>> = {};
  
  languages.forEach(lang => {
    resources[lang] = {
      translation: {
        hello: `Hello in ${lang}`,
        welcome: `Welcome in ${lang}`,
        goodbye: `Goodbye in ${lang}`
      }
    };
  });
  
  return resources;
};
