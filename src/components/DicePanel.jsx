import React from 'react'
import Die from './Die'

export default function DicePanel({results, rolling, tvMode}){
  const total = results.reduce((sum, r) => sum + r.value, 0)
  
  return (
    <div className="panel dice-area">
      {results.length === 0 && <div className="hint">Selecciona dados y lanza la tirada</div>}
      {results.length > 0 && (
        <div className={`total-die ${tvMode ? 'tv' : ''}`}>
          <div className="total-label">TOTAL</div>
          <div className="total-value">{total}</div>
        </div>
      )}
      {results.map((r, i) => (
        <Die key={i+"-"+r.sides+"-"+i} sides={r.sides} value={r.value} rolling={rolling} tvMode={tvMode} />
      ))}
    </div>
  )
}
