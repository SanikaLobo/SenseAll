// eslint-disable-next-line no-unused-vars
import React from 'react';
import './../css/loader.css';

export default function Loadingscreen() {
  return (
    <>
      <div className="load-container">
        <div className="terminal-loader">
          <div className="terminal-header">
            <div className="terminal-title">Status</div>
            <div className="terminal-controls">
              <div className="control close"></div>
              <div className="control minimize"></div>
              <div className="control maximize"></div>
            </div>
          </div>
          <div className="loader-text">py ishaara.py</div>
        </div>
      </div>
    </>
  )
}
