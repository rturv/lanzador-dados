import React from 'react'
import Die from './Die'

export default function DicePanel({results, rolling, tvMode, modifier = 0}){
  const total = results.reduce((sum, r) => sum + r.value, 0)
  const finalTotal = total + modifier
  const hasModifier = modifier !== 0 && modifier !== null && modifier !== undefined
  
  return (
    <div className="panel dice-area">
      {results.length === 0 && <div className="hint">Selecciona dados y lanza la tirada</div>}
      {results.length > 0 && (
        <div className={`total-die ${tvMode ? 'tv' : ''}`}>
          <div className="total-label">TOTAL</div>
          <div className="total-value">{finalTotal}</div>
        </div>
      )}
      {results.map((r, i) => (
        <Die key={i+"-"+r.sides+"-"+i} sides={r.sides} value={r.value} rolling={rolling} tvMode={tvMode} />
      ))}
      {hasModifier && results.length > 0 && (
        <div className={`die modifier-die ${tvMode ? 'tv' : ''} ${rolling ? 'rolling' : ''}`} role="img" aria-label={`Modificador ${modifier >= 0 ? '+' : ''}${modifier}`}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,flexDirection:'column'}}>
            <div className="die-value modifier-value">{modifier >= 0 ? '+' : ''}{modifier}</div>
          </div>
        </div>
      )}
    </div>
  )
}
