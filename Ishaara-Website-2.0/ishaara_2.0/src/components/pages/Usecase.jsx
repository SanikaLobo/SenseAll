// eslint-disable-next-line no-unused-vars
import React from 'react'

import './../../css/usecase.css'

export default function Usecase() {
  return (
    <>
      <div className="use_heading">
      Use <span style={{color:'red'}}> Cases</span>
    </div>
    <div className="use-container">
    <div className="use-card">
  <div className="use-card-inner">
    <div className="use-card-front">
      <p>Education</p>
    </div>
    <div className="use-card-back">
      <p>Schools for the Deaf</p>
      <p>Inclusive Education</p>
    </div>
  </div>
</div>
<div className="use-card">
  <div className="use-card-inner">
    <div className="use-card-front">
      <p>Digital Communication</p>
    </div>
    <div className="use-card-back">
      <p>Conversations</p>
      <p>Social Gatherings</p>
    </div>
  </div>
</div>
<div className="use-card">
  <div className="use-card-inner">
    <div className="use-card-front">
      <p>Quick Communication</p>
    </div>
    <div className="use-card-back">
      <p>Quickly Communicate without Latency</p>
    </div>
  </div>
</div>
<div className="use-card">
  <div className="use-card-inner">
    <div className="use-card-front">
      <p>Healthcare</p>
    </div>
    <div className="use-card-back">
    <p>Medical Consultations</p>
    <p>Health Education</p>
    </div>
  </div>
</div>
      </div>
    </>
  )
}
