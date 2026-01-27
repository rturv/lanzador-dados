// Domain: dice rolling logic (pure, testable)
export function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1
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
