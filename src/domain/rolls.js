// Domain: dice rolling logic (pure, testable)

function getRandomNumber() {
  // Intentar usar Web Crypto API (navegador o Node >= 19 with globalThis.crypto)
  try {
    const webcrypto = (typeof globalThis !== 'undefined' && globalThis.crypto) || (typeof require !== 'undefined' && (() => {
      try { return require('crypto').webcrypto } catch(e) { return null }
    })())
    if (webcrypto && typeof webcrypto.getRandomValues === 'function') {
      const array = new Uint32Array(1)
      webcrypto.getRandomValues(array)
      return array[0] / (0xffffffff + 1)
    }
  } catch (e) {
    // ignore and fallback to Math.random
  }

  // Fallback razonable para entornos sin Web Crypto (p. ej. versiones antiguas de Node en CI)
  return Math.random()
}

export function rollDie(sides) {
  return Math.floor(getRandomNumber() * sides) + 1
}

export function rollMultiple(sides, count) {
  const results = []
  for (let i = 0; i < count; i++) results.push(rollDie(sides))
  return results
}

export function rollConfig(config) {
  // config: [{sides:20,count:2}, ...]
  const items = []
  config.forEach((c) => {
    const res = rollMultiple(c.sides, c.count)
    res.forEach((v) => items.push({sides: c.sides, value: v}))
  })
  const total = items.reduce((s, it) => s + it.value, 0)
  return {items, total}
}
