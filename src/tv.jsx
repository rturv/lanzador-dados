import React, {useEffect, useRef, useState} from 'react'
import { createRoot } from 'react-dom/client'
import TVView from './components/TVView'
import './styles.css'

function normalize(history){
  if(!Array.isArray(history)) return []
  return history.map((item, idx)=> ({
    ...item,
    timestamp: item.timestamp || (Date.now() - idx * 60000)
  }))
}

function TVApp(){
  const [history, setHistory] = useState([])
  const [rolling, setRolling] = useState(false)
  const lastTsRef = useRef(0)

  useEffect(()=>{
    try{
      const saved = localStorage.getItem('dados.theme')
      if(saved === 'dark') document.body.classList.add('theme-dark')
      else document.body.classList.remove('theme-dark')
    }catch(e){}

    function load(){
      try{
        try{
          const saved = localStorage.getItem('dados.theme')
          if(saved === 'dark') document.body.classList.add('theme-dark')
          else document.body.classList.remove('theme-dark')
        }catch(e){}
        const raw = localStorage.getItem('dados.history')
        const parsed = raw ? JSON.parse(raw) : []
        const next = normalize(parsed)
        const latestTs = next[0]?.timestamp || 0
        if(latestTs && latestTs !== lastTsRef.current){
          lastTsRef.current = latestTs
          setRolling(true)
          setTimeout(()=>setRolling(false), 1200)
        }
        setHistory(next)
      }catch(e){
        setHistory([])
      }
    }
    load()
    const id = setInterval(load, 900)
    return ()=> clearInterval(id)
  },[])

  return <TVView lastRolls={history} rolling={rolling} />
}

createRoot(document.getElementById('tv-root')).render(<TVApp />)
