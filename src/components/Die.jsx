import React, {useEffect, useState} from 'react'
import DieIcon from './DieIcon'

export default function Die({sides, value, rolling, tvMode}){
  const [animateKey, setAnimateKey] = useState(0)
  useEffect(()=>{
    // trigger animation when rolling changes
    if (rolling) setAnimateKey(k => k+1)
  },[rolling])

  const sizeClass = tvMode ? 'die tv' : 'die'
  const style = { '--roll-duration': tvMode ? '1200ms' : '700ms' }

  return (
    <div className={`${sizeClass} die-${sides} ${rolling ? 'rolling' : ''}`} key={animateKey} style={style} role="img" aria-label={`d${sides} ${value}`}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,flexDirection:'column'}}>
        <DieIcon sides={sides} className="die-shape" />
        <div className="die-value">{value}</div>
      </div>
    </div>
  )
}
