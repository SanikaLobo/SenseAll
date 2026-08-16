// eslint-disable-next-line no-unused-vars
import React from 'react';
import heroimg from './../../assets/hero.png';
import './../../css/style.css';
import { Link } from 'react-router-dom'
// import {Counter,Services,Features,Try,About} from "./";
import {Counter,Services,Features,Try, Footer, Usecase, Architecture, Objectives} from "./";


const Hero = () => {
  return (
    <section
      id="hero"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: '80%',
        // marginBottom: '21vh',
        background:'white'
      }}
    >
      <div style={{ padding: '3.5%', marginBottom:'10%'}}>
        <div className='wrapper'
        >
          {/* wrapper */}
          <div
            style={{
              flex: 1,
              marginTop: '2%',
              fontFamily: 'Inter',
            }}
          >
            <p
              style={{
                fontSize: '2rem',
                marginTop: '20%',
                marginLeft: '2%',
                fontWeight: '300',
                color: '#808080',
               
              }}
            >
              Convert Indian Sign Language
              <br />
              To Text In <br />
              Real-Time With ISHAARA
            </p>
            <div
              className="wrap"
              style={{
                marginTop: '3%',
                marginRight: '19vw',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Link className="get_tlink" to='/Translate'><button className='get'>Get <span>Started</span></button></Link>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <img
              src={heroimg}
              style={{
                width: '100%',
                maxHeight: 'auto',
                borderTopRightRadius: '100px',
                marginTop: '-10px',
              }}
              alt="Your Image"
            />
          </div>
        </div>
      </div>
      <Counter />
    <Services/>
    <Features/>
    <Usecase />
    <Try />
    <Objectives />
    <Architecture/>
    <Footer/>
    {/* <About/> */}
    </section>

  );
};

export default Hero;
