import { LanguageStore } from "./types";
export class DefaultLanguageStore implements LanguageStore {
  private storage: Map<string, string> = new Map();

  getLanguage(): string | null {
    return this.storage.get("language") || null;
  }

  setLanguage(language: string): void {
    this.storage.set("language", language);
  }
}
