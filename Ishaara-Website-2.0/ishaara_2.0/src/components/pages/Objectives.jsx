// eslint-disable-next-line no-unused-vars
import React from 'react'
import Education from './../../assets/education.png'
import Hardware from './../../assets/hardware.jpeg'
import Social from './../../assets/social.jpeg'
import Digital from './../../assets/digital.jpeg'
// import Emergency from './../../assets/emergency.jpeg'
// import Government from './../../assets/government.jpeg'
// import Medical from './../../assets/medical.jpeg'
import './../../css/usecase.css'

export default function Objectives() {
  return (
    <>
      <div className="use_heading">
      Obje<span style={{color:'red'}}>ctives</span>
    </div>
    <div className="obj-container">
      <div className="obj-media">
        <div className="obj-media-content-1">
          <h3>Enhance Communication Accessibility</h3>
          <p className='p'>Enable seamless communication for the deaf and hard of hearing by translating ISL into spoken languages and vice versa, promoting inclusivity and equal opportunities.</p>
        </div>
        <div className="obj-media-image-1">
        <img src={Social}/>
        </div>
      </div>
      <div className="obj-media">
      <div className="obj-media-image-2">
        <img src={Digital}/>
        </div>
        <div className="obj-media-content-2">
          <h3>Bridge Communication Gaps</h3>
          <p className='p'>Facilitate better understanding and interaction between the deaf and hearing communities, enhancing integration and respect.</p>
        </div>
      </div>
      <div className="obj-media">
        <div className="obj-media-content-1">
          <h3>Accessibility Without External Hardware</h3>
          <p className='p'>Ensure practical, cost-effective use by operating on standard devices like smartphones and computers, making the tool accessible to a broader audience.</p>
        </div>
        <div className="obj-media-image-1">
        <img src={Hardware}/>
        </div>
      </div>
      <div className="obj-media">
      <div className="obj-media-image-2">
        <img src={Education}/>
        </div>
        <div className="obj-media-content-2">
          <h3>Support Educational and Professional Development</h3>
          <p className='p'>Improve communication in educational and workplace settings, aiding learning and career progression for the deaf and hard of hearing.</p>
        </div>
      </div>
      </div>
    </>
  )
}
