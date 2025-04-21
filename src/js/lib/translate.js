// Patrón: Adapter
// Translator simulator
export function translateString(string) {
  return `TRANSLATED: ${string}`
}

// Patrón: Command Pattern
class Translator {
  toEnglish(string) {
    return `EN: ${string}`
  }
  // toFrench...
}

export const translate = new Translator
