import React, {useEffect, useMemo, useState} from 'react'
import { rollConfig } from './domain/rolls'
import { MacroRepository } from './repos/macroRepository'
import DicePanel from './components/DicePanel'
import MacroList from './components/MacroList'
import MacroEditor from './components/MacroEditor'
import TVView from './components/TVView'
import DieIcon from './components/DieIcon'

function uuid(){return Math.random().toString(36).slice(2,9)}

const DICE_SIDES = [4,6,8,10,12,20]

export default function App(){
  const [selection, setSelection] = useState({})
  const [results, setResults] = useState([])
  const [rolling, setRolling] = useState(false)
  const [macros, setMacros] = useState([])
  const [history, setHistory] = useState([])
  const [tvMode, setTvMode] = useState(false)
  const [diceOpen, setDiceOpen] = useState(false)
  const [macroOpen, setMacroOpen] = useState(false)
  const [macroEditorOpen, setMacroEditorOpen] = useState(false)
  const [quickText, setQuickText] = useState('2d20+1d6')
  const [modifier, setModifier] = useState(0)
  const [theme, setTheme] = useState('light')

  useEffect(()=>{
    setMacros(MacroRepository.load())
  },[])

  useEffect(()=>{
    MacroRepository.save(macros)
  },[macros])

  useEffect(()=>{
    try{ localStorage.setItem('dados.history', JSON.stringify(history)) }catch(e){}
  },[history])

  useEffect(()=>{
    try{
      const saved = localStorage.getItem('dados.theme')
      if(saved) setTheme(saved)
    }catch(e){}
  },[])

  useEffect(()=>{
    try{ localStorage.setItem('dados.theme', theme) }catch(e){}
    if(theme === 'dark'){
      document.body.classList.add('theme-dark')
    } else {
      document.body.classList.remove('theme-dark')
    }
  },[theme])

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('dados.history')
      if(raw){
        const parsed = JSON.parse(raw)
        if(Array.isArray(parsed)){
          const normalized = parsed.map((item, idx)=> ({
            ...item,
            timestamp: item.timestamp || (Date.now() - idx * 60000)
          }))
          setHistory(normalized)
        }
      }
    }catch(e){}
  },[])

  useEffect(()=>{
    if(!tvMode) return
    function onKey(e){
      if(e.key === 'Escape') setTvMode(false)
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[tvMode])

  useEffect(()=>{
    if(diceOpen || macroOpen){
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
  },[diceOpen, macroOpen])

  function stepDice(sides, delta){
    setSelection(s => {
      const next = Math.max(0, (s[sides] || 0) + delta)
      return {...s, [sides]: next}
    })
  }

  function buildConfig(){
    return Object.entries(selection).map(([s,c])=>({sides:parseInt(s,10),count:c})).filter(x=>x.count>0)
  }

  function formatConfig(cfg, mod = 0){
    if(!cfg || cfg.length===0) return ''
    const parts = cfg
      .filter(c=>c.count>0)
      .map(c=>`${c.count}d${c.sides}`)
    if(mod){
      parts.push(`${mod >= 0 ? '+' : ''}${mod}`)
    }
    return parts.join('+')
  }

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

  function doRoll(cfg, mod = 0){
    setRolling(true)
    // Vibrate if supported
    if(navigator.vibrate) navigator.vibrate(120)
    // animate then compute
    const delay = tvMode ? 1200 : 700
    setTimeout(()=>{
      const result = rollConfig(cfg)
      const baseTotal = result.total
      const modValue = Number(mod) || 0
      const stamped = {...result, baseTotal, modifier: modValue, total: baseTotal + modValue, timestamp: Date.now(), config: cfg, label: formatConfig(cfg, modValue)}
      setResults(result.items)
      setHistory(h=>[stamped,...h].slice(0,30))
      setRolling(false)
    },delay)
  }

  function onRollClick(){
    const cfg = buildConfig()
    if(cfg.length===0) return
    setQuickText(formatConfig(cfg, modifier))
    doRoll(cfg, modifier)
    // Cerrar paneles en móvil para mostrar resultados
    setDiceOpen(false)
    setMacroOpen(false)
  }

  function onQuickRoll(){
    const parsed = parseText(quickText)
    if(parsed.config.length===0) return
    doRoll(parsed.config, parsed.modifier)
    // Cerrar paneles en móvil para mostrar resultados
    setDiceOpen(false)
    setMacroOpen(false)
  }

  function handleSaveMacro(m){
    const baseName = (m.name || 'Macro').trim() || 'Macro'
    const existing = macros.map(x => x.name)
    let finalName = baseName
    let counter = 2
    while(existing.includes(finalName)){
      finalName = `${baseName} ${counter}`
      counter += 1
    }
    const item = {id:uuid(),name:finalName,icon:m.icon,config:m.config,modifier:m.modifier || 0,text:m.text}
    setMacros(prev=>[item,...prev])
  }

  function handleRunMacro(m){
    if(!m.config || m.config.length===0) return
    setQuickText(formatConfig(m.config, m.modifier || 0))
    doRoll(m.config, m.modifier || 0)
    // Cerrar paneles en móvil para mostrar resultados
    setDiceOpen(false)
    setMacroOpen(false)
  }

  function handleDeleteMacro(m){
    setMacros(prev=>prev.filter(x=>x.id!==m.id))
  }

  const total = useMemo(()=> results.reduce((s,r)=>s+r.value,0),[results])
  const latest = history[0]

  function openTvScreen(){
    window.open('/lanzador-dados/tv.html','dados-tv','width=1280,height=720')
  }

  return (
    <div className={`app ${tvMode ? 'app-tv' : ''}`}>
      {!tvMode && (
        <div className="header">
          <div className="brand">
            <div className="brand-mark">Dados</div>
            <div className="brand-sub">Lanzador cinematografico</div>
          </div>
          <div className="controls">
            <button className="sidebar-toggle" onClick={()=>setDiceOpen(true)}>
              Dados
            </button>
            <button className="sidebar-toggle" onClick={()=>setMacroOpen(true)}>
              Macros
            </button>
            <button className="theme-btn" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')}>
              {theme === 'dark' ? 'Claro' : 'Oscuro'}
            </button>
            <button className="tv-btn" onClick={openTvScreen} title="Abrir pantalla TV">
              <span className="tv-emoji">📺</span>
              Pantalla TV
            </button>
          </div>
        </div>
      )}

      {tvMode ? (
        <div className="tv-container">
          <TVView lastRolls={history} rolling={rolling} />
        </div>
      ) : (
        <div className="app-shell">
          <aside className={`sidebar sidebar-left ${diceOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <div className="panel-title">Dados</div>
              <button className="close-btn" onClick={()=>setDiceOpen(false)}>×</button>
            </div>
            <div className="panel selector-panel">
              <div className="dice-selector">
                {DICE_SIDES.map(s=> (
                  <div key={s} className={`dice-card ${selection[s] ? 'active' : ''}`}>
                    <button className={`dice-visual die-${s}`} onClick={()=>stepDice(s,1)} aria-label={`Agregar d${s}`}>
                      <DieIcon sides={s} className="die-shape" />
                      <span className="dice-type">d{s}</span>
                    </button>
                    <div className="dice-counter">
                      <button onClick={()=>stepDice(s,-1)} aria-label={`Quitar d${s}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <div className="count">{selection[s] || 0}</div>
                      <button onClick={()=>stepDice(s,1)} aria-label={`Agregar d${s}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="modifier-row">
                <div className="modifier-label">Modificador</div>
                <div className="modifier-control">
                  <button onClick={()=>setModifier(m=>m-1)} aria-label="Decrementar modificador">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    value={modifier}
                    onChange={e=>setModifier(parseInt(e.target.value || 0,10))}
                  />
                  <button onClick={()=>setModifier(m=>m+1)} aria-label="Incrementar modificador">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="roll-actions">
                <div className="total">
                  Ultimo total: {latest ? latest.total : total}
                  {latest?.modifier ? ` (${latest.modifier >= 0 ? '+' : ''}${latest.modifier})` : ''}
                </div>
                <button className="roll-btn" onClick={onRollClick}>Lanzar dados</button>
              </div>
            </div>
          </aside>

          <main className="main">
            <div className="panel quick-roll">
              <div className="panel-title">Tirada rapida</div>
              <div className="quick-row">
                <input
                  className="input"
                  value={quickText}
                  onChange={e=>setQuickText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onQuickRoll(); } }}
                  placeholder="Ej: 2d20+1d6"
                />
                <button className="roll-btn" onClick={onQuickRoll}>Lanzar rapido</button>
              </div>
            </div>
            <DicePanel results={results} rolling={rolling} tvMode={tvMode} />
            <div className="panel timeline-panel">
              <div className="panel-title">Linea de tiempo</div>
              <div className="timeline">
                {history.map((h,idx)=> (
                  <div key={idx} className="timeline-row">
                    <div className="timeline-time">
                      {new Date(h.timestamp).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-label-text">{h.label || formatConfig(h.config || [], h.modifier || 0)}</div>
                      <div className="timeline-dice">
                        {h.items.map((it,di)=> (
                          <div key={di} className="timeline-die">
                            <DieIcon sides={it.sides} className="timeline-icon" />
                            <span className="timeline-value">{it.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="timeline-total">
                        Total {h.total}
                        {h.modifier ? ` (${h.modifier >= 0 ? '+' : ''}${h.modifier})` : ''}
                      </div>
                    </div>
                  </div>
                ))}
                {history.length===0 && <div className="hint">Las tiradas apareceran aqui con su contexto.</div>}
              </div>
            </div>
            <div className="footer">
              <div className="footer-note">PWA lista · Offline listo</div>
              <div className="footer-note">Tiradas recientes: {history.length}</div>
            </div>
          </main>

          <aside className={`sidebar sidebar-right ${macroOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <div className="panel-title">Macros</div>
              <button className="close-btn" onClick={()=>setMacroOpen(false)}>×</button>
            </div>
            <MacroList macros={macros} onRun={handleRunMacro} onDelete={handleDeleteMacro} />
            <button className="collapse-btn" onClick={()=>setMacroEditorOpen(o=>!o)}>
              {macroEditorOpen ? 'Ocultar creador' : 'Crear macro'}
            </button>
            {macroEditorOpen && <MacroEditor onSave={handleSaveMacro} />}
          </aside>
          {(diceOpen || macroOpen) && <div className="sidebar-backdrop" onClick={()=>{setDiceOpen(false);setMacroOpen(false)}} />}
        </div>
      )}
    </div>
  )
}
