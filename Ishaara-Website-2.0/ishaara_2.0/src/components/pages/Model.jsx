// eslint-disable-next-line no-unused-vars
import React from 'react';
import './../../css/model.css';
import F1 from './../../assets/rnn.gif';
import F2 from './../../assets/convlstm.gif';
import F3 from './../../assets/3d.gif';
export default function Model() {
  return (
    <>
    <div className="title_heading">
      Model
    </div>
    <div className='container'>

<div className="card">
  <div className="bg"><img src={F1}/>
  <h5>GRU based Ishaara Net</h5>
  </div>
  <div className="blob"></div>
</div>

<div className="card">
  <div className="bg"><img src={F2}/>
  <h5>Conv+Lstm based Ishaara Net</h5>
  </div>
  <div className="blob"></div>
</div>

<div className="card">
  <div className="bg"><img src={F3}/>
  <h5>3D Ishaara Net</h5>
  </div>
  <div className="blob"></div>
</div>
</div>
</>
  )
}
