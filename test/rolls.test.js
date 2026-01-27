import { describe, it, expect } from 'vitest'
import { rollDie, rollMultiple, rollConfig } from '../src/domain/rolls'

describe('rolls domain', ()=>{
  it('rollDie returns value between 1 and sides', ()=>{
    for(let s of [4,6,8,10,12,20]){
      const v = rollDie(s)
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(s)
    }
  })

  it('rollMultiple returns correct count', ()=>{
    const arr = rollMultiple(6,5)
    expect(arr.length).toBe(5)
    for(const v of arr) expect(v).toBeGreaterThanOrEqual(1)
  })

  it('rollConfig aggregates items and total', ()=>{
    const cfg = [{sides:6,count:2},{sides:4,count:1}]
    const res = rollConfig(cfg)
    expect(res.items.length).toBe(3)
    expect(res.total).toBe(res.items.reduce((s,i)=>s+i.value,0))
  })
})
