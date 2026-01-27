// Repository abstraction for macros. Implements localStorage-backed storage.
const STORAGE_KEY = 'dados.macros.v1'

export const MacroRepository = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      return JSON.parse(raw)
    } catch (e) {
      console.warn('Failed to load macros', e)
      return []
    }
  },
  save(macros) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(macros))
    } catch (e) {
      console.warn('Failed to save macros', e)
    }
  },
}
