// eslint-disable-next-line no-unused-vars
import React from 'react'
import Counting from './../Counting'
import './../../css/style.css'
// import Number from Num.jsx;
export default function Counter() {
  return (
    <section id="count" style={{background:'white'}}>
    <div style={{fontFamily: 'Inter' }}>
        <div className='c-wrapper'>
            {/* Card 1*/}
            {/* width: '18%', height: '11%' */}
            <div className='c-card'>
                <div style={{ color: 'red', fontSize: '1.02rem', fontWeight: '300', marginBottom: '2%' }}>Number of Deaf and Mute People in India</div>
                <div style={{ color: '#33D9E3', fontSize: '32px', fontWeight: '500', marginBottom: '5%' }}><Counting n={630000000}/></div>
                <div style={{ position: 'relative', bottom: '15px', left: 0, width: '100%', height: '0.1rem', backgroundImage: 'linear-gradient(to right, red, red)' }} />
            </div>

            {/* Card 2*/}
            <div className='c-card'>
                <div style={{ color: 'red', fontSize: '1.02rem', fontWeight: '300', marginBottom: '2%' }}>Number of Users of Indian Sign Language</div>
                <div style={{ color: '#33D9E3', fontSize: '32px', fontWeight: '500', marginBottom: '5%' }}><Counting n={84350000}/></div>
                <div style={{ position: 'relative', bottom: '2vh', left: 0, width: '100%', height: '0.1rem', backgroundImage: 'linear-gradient(to right, red, red)' }} />
            </div>

            {/* Card 3*/}
            <div className='c-card'>
                <div style={{ color: 'red', fontSize: '1.02rem', fontWeight: '300', marginBottom: '2%' }}>Number of people working as ISL Translators</div>
                <div style={{ color: '#33D9E3', fontSize: '32px', fontWeight: '500', marginBottom: '5%' }}><Counting n={250}/></div>
                <div style={{ position: 'relative', bottom: '15px', left: 0, width: '100%', height: '0.1rem', backgroundImage: 'linear-gradient(to right, red, red)' }} />
            </div>
        </div>
    </div>
    </section>
  )
}
