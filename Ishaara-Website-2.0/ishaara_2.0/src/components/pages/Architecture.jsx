// eslint-disable-next-line no-unused-vars
import React from 'react'
import './../../css/style.css'
import Archi from './../../assets/architecture.gif';

export default function Architecture() {
  return (
    <>
    <div style={{ margin: '5%'}}>
      <div className="arc_heading">
      Archi<span style={{color:'red'}}>tecture</span>
    </div>
    <div className="arc-container">
      <img src={Archi} alt="architecture" />
      </div>
    </div>
  

    </>
  )
}
