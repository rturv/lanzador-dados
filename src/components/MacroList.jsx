import React from 'react'

export default function MacroList({macros, onRun, onDelete}){
  return (
    <div className="panel macro-list-panel">
      <div className="macro-grid">
        {macros.length===0 && <div className="hint">No hay macros guardadas</div>}
        {macros.map((m)=> (
          <div key={m.id} className="macro-card">
            <button className="macro-run" onClick={()=>onRun(m)}>
              <span className="macro-emoji">{m.icon}</span>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
                <span className="macro-name">{m.name}</span>
                <span className="macro-text">{m.text}{m.modifier ? ` (${m.modifier >= 0 ? '+' : ''}${m.modifier})` : ''}</span>
              </div>
            </button>
            <button onClick={()=>onDelete(m)} className="macro-delete" aria-label={`Eliminar ${m.name}`}>×</button>
          </div>
        ))}
      </div>
    </div>
  )
}
