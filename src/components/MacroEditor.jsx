import React, {useState} from 'react'

const ICONS = ['🎲','⚔️','🛡️','✨','🔥','🧪','🏹','🗝️','🧿','🧭','🕯️','🧲']

export default function MacroEditor({onSave, initial}){
  const [name, setName] = useState(initial?.name || '')
  const [icon, setIcon] = useState(initial?.icon || ICONS[0])
  const [text, setText] = useState(initial?.text || '1d20')

  function parseText(t){
    const clean = String(t || '').replace(/\s+/g,'')
    const tokens = clean.match(/[+-]?[^+-]+/g) || []
    const config = []
    let mod = 0
    for(const token of tokens){
      const sign = token.startsWith('-') ? -1 : 1
      const body = token.replace(/^[-+]/,'')
      const m = body.match(/(\d*)d(\d+)/i)
      if(m){
        const count = m[1] ? parseInt(m[1],10) : 1
        const sides = parseInt(m[2],10)
        config.push({count: count * sign, sides})
      } else if(body){
        const value = parseInt(body,10)
        if(!Number.isNaN(value)) mod += value * sign
      }
    }
    return {config: config.filter(c=>c.count>0), modifier: mod}
  }

  return (
    <div className="panel macro-editor">
      <div className="panel-title">Crear macro</div>
      <div className="macro-row">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre" className="input" />
      </div>
      <div className="macro-row">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Ej: 2d20+1d6" className="input" />
      </div>
      <div className="icon-grid">
        {ICONS.map(ic=> (
          <button key={ic} className={`icon-btn ${icon===ic ? 'active' : ''}`} onClick={()=>setIcon(ic)} type="button" aria-label={`Icono ${ic}`}>
            <span style={{fontSize:20,lineHeight:1}}>{ic}</span>
          </button>
        ))}
      </div>
      <div className="macro-actions">
        <button className="roll-btn" onClick={()=>{
          const parsed = parseText(text)
          onSave({name,icon,config:parsed.config,modifier:parsed.modifier,text})
        }}>Guardar macro</button>
      </div>
    </div>
  )
}
