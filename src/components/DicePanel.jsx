import React from 'react'
import Die from './Die'

export default function DicePanel({results, rolling, tvMode}){
  return (
    <div className="panel dice-area">
      {results.length === 0 && <div className="hint">Selecciona dados y lanza la tirada</div>}
      {results.map((r, i) => (
        <Die key={i+"-"+r.sides+"-"+i} sides={r.sides} value={r.value} rolling={rolling} tvMode={tvMode} />
      ))}
    </div>
  )
}
