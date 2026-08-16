// eslint-disable-next-line no-unused-vars
import React from 'react';
import F1 from './../../assets/f1.png';
import F2 from './../../assets/f2.png';
import F3 from './../../assets/f3.png';
import F4 from './../../assets/f4.png';
import F5 from './../../assets/f5.png';
import F6 from './../../assets/f6.png';
export default function Features() {
  return (
    <section id='features' style={{ backgroundColor:'#fff', paddingTop: '0.6%', marginBottom:'2.6%',justifyContent: 'center', alignItems: 'center'}}>
      <div style={{ maxWidth: '100%', padding: '0 1.6%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ marginTop: '3.2%', fontSize: '1.875rem', lineHeight: '3.6%', fontWeight: '800', letterSpacing: '-0.04%', color: '#374151' }}>
            Key <span style={{ color: '#EF4444' }}>Features</span>
          </h3>
        </div>

        <div style={{ marginTop: '1.6%' }}>
          <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.6rem', listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginTop: '1.6%', border: '2px solid #EF4444', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.2%', backgroundColor: '#fff' }}>
                <img src={F1} alt="Description of your image" style={{ height: '60px', width: '60px', margin: '0.8rem' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '1rem', lineHeight: '1.25rem', fontWeight: '500', color: '#374151' }}>SIGN TO TEXT</h4>
                <p style={{ marginTop: '0%', fontSize: '0.8rem', lineHeight: '1.5rem', color: '#6B7280' }}>Automatically translates sign language gestures into written text.</p>
              </div>
            </li>
            <li style={{ marginTop: '1.6%', border: '2px solid #EF4444', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.2%', backgroundColor: '#fff' }}>
                <img src={F2} alt="Description of your image" style={{ height: '60px', width: '60px', margin: '0.8rem' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '1rem', lineHeight: '1.25rem', fontWeight: '500', color: '#374151' }}>DEPTH DETECTION</h4>
                <p style={{ marginTop: '0%', fontSize: '0.8rem', lineHeight: '1.5rem', color: '#6B7280' }}>Utilizes advanced technology to accurately detect the depth and position of sign language movements.</p>
              </div>
            </li>
            <li style={{ marginTop: '1.6%', border: '2px solid #EF4444', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.2%', backgroundColor: '#fff' }}>
                <img src={F3} alt="Description of your image" style={{ height: '60px', width: '60px', margin: '0.8rem' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '1rem', lineHeight: '1.25rem', fontWeight: '500', color: '#374151' }}>GRAMATICALLY CORRECT</h4>
                <p style={{ marginTop: '0%', fontSize: '0.8rem', lineHeight: '1.5rem', color: '#6B7280' }}>Ensures that the translated text maintains proper grammar and syntax.</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div style={{ margin: '3.2% 0' }}>&nbsp;</div>
        {/* <hr style={{ margin: '3.2% auto', maxWidth: '100%', borderColor: '#EF4444', borderWidth: '0.5%' }} /> */}

        <div style={{ textAlign: 'center', marginTop: '3.2%' }}>
          <h3 style={{ fontSize: '1.875rem', lineHeight: '3.6%', fontWeight: '800', letterSpacing: '-0.04%', color: '#374151' }}>
            AI <span style={{ color: '#EF4444' }}>Inside</span>
          </h3>
        </div>

        <div style={{ marginTop: '1.6%' }}>
          <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.6rem', listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginTop: '1.6%', border: '2px solid #EF4444', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.2%', backgroundColor: '#fff' }}>
                <img src={F4} alt="Description of your image" style={{ height: '60px', width: '60px', margin: '0.8rem' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '1rem', lineHeight: '1.25rem', fontWeight: '500', color: '#374151' }}>HIGH ACCURACY</h4>
                <p style={{ marginTop: '0%', fontSize: '0.8rem', lineHeight: '1.5rem', color: '#6B7280' }}>Provides precise and reliable translations with minimal errors.</p>
              </div>
            </li>
            <li style={{ marginTop: '1.6%', border: '2px solid #EF4444', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.2%', backgroundColor: '#fff' }}>
                <img src={F5} alt="Description of your image" style={{ height: '60px', width: '60px', margin: '0.8rem' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '1rem', lineHeight: '1.25rem', fontWeight: '500', color: '#374151' }}>LLM POWERED</h4>
                <p style={{ marginTop: '0%', fontSize: '0.8rem', lineHeight: '1.5rem', color: '#6B7280' }}>Employs a Language Model with high proficiency and understanding, enhancing translation accuracy.</p>
              </div>
            </li>
            <li style={{ marginTop: '1.6%', border: '2px solid #EF4444', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.2%', backgroundColor: '#fff' }}>
                <img src={F6} alt="Description of your image" style={{ height: '60px', width: '60px', margin: '0.8rem' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '1rem', lineHeight: '1.25rem', fontWeight: '500', color: '#374151' }}>UNIQUE MODEL</h4>
                <p style={{ marginTop: '0%', fontSize: '0.8rem', lineHeight: '1.5rem', color: '#6B7280' }}>Utilizes a proprietary model specifically tailored for sign language translation, offering distinct advantages over conventional approaches.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}