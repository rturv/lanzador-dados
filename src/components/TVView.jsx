import React, {useEffect, useState} from 'react'
import DieIcon from './DieIcon'

function formatTime(ts){
  const d = new Date(ts)
  const hh = String(d.getHours()).padStart(2,'0')
  const mm = String(d.getMinutes()).padStart(2,'0')
  return `${hh}:${mm}`
}

export default function TVView({lastRolls, rolling}){
  const latest = lastRolls[0]
  const [pulseKey, setPulseKey] = useState(0)

  useEffect(()=>{
    if(latest?.timestamp) setPulseKey(k=>k+1)
  },[latest?.timestamp])
  return (
    <div className="tv-stage">
      {latest ? (
        <div className="tv-hero" key={pulseKey}>
          <div className="tv-title">ULTIMA TIRADA</div>
          <div className="tv-total">{latest.total}</div>
          <div className="tv-meta">
            <span className="tv-time">{formatTime(latest.timestamp)}</span>
            <span className="tv-pill">{latest.items.length} dados</span>
            {latest.modifier ? (
              <span className="tv-pill">{latest.modifier >= 0 ? '+' : ''}{latest.modifier}</span>
            ) : null}
          </div>
          <div className={`tv-results ${rolling ? 'rolling' : ''}`}>
            {latest.items.map((it, idx)=> (
              <div key={idx} className={`tv-die die-${it.sides} ${rolling ? 'rolling' : ''}`}>
                <DieIcon sides={it.sides} className="die-shape" />
                <div className="tv-die-value">{it.value}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="tv-empty">Sin tiradas recientes</div>
      )}
      <div className="tv-timeline">
        <div className="timeline-title">Historial</div>
        <div className="timeline-list">
          {lastRolls.slice(0,8).map((r,idx)=> (
            <div className="timeline-item" key={idx}>
              <div className="timeline-time">{formatTime(r.timestamp)}</div>
              <div className="timeline-dice">
                {r.items.map((it, di)=> (
                  <div key={di} className="timeline-die">
                    <DieIcon sides={it.sides} className="timeline-icon" />
                    <span className="timeline-value">{it.value}</span>
                  </div>
                ))}
              </div>
              <div className="timeline-total">{r.total}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
