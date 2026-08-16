// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Link } from 'react-router-dom'
// import Translate from './Translate';
export default function Tryitnow() {
  return (
    <section id="try" style={{background:'white'}}>
    <div style={{ fontFamily: 'Inter' }}>
      <div style={{ textAlign: 'center', fontSize: '4rem', color: '#33D9E3', marginBottom:'20px'}}>
          <Link  style={{textDecoration:'none', color:'red'}} to='/Translate' ><span style={{color:'black'}}>TRY</span> IT NOW</Link>        
      </div>
    </div>
    </section>
  )
}
