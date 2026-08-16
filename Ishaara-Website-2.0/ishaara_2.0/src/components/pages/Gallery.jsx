// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import './../../css/gallery.css';
import V1 from './../../assets/vid/VID-20240428-WA0001.mp4';
import V2 from './../../assets/vid/VID-20240428-WA0002.mp4';
import V3 from './../../assets/vid/VID-20240428-WA0003.mp4';
import V4 from './../../assets/vid/VID-20240428-WA0004.mp4';
import V5 from './../../assets/vid/VID-20240428-WA0005.mp4';

const Gallery = () => {
  const [modalContent, setModalContent] = useState(null);

  const handleImageClick = (src) => {
    setModalContent(<img src={src} className="modal-img" />);
    document.getElementById('myModal').style.display = 'block';
  };

  const handleVideoClick = (src) => {
    setModalContent(<video className="model-vid" controls><source src={src} type="video/mp4" /></video>);
    document.getElementById('myModal').style.display = 'block';
  };

  const closeModal = () => {
    setModalContent(null);
    document.getElementById('myModal').style.display = 'none';
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'Satisfy', fontSize: '50px', textAlign: 'center', color: 'black', padding: '1%' }}>
        Ishaara Gallery
      </h1>
      <hr />
      <div id="gallery" className="container-fluid">
        <img src="https://i.ibb.co/FzMMxdW/IMG-20240428-WA0006.jpg" className="img-responsive" onClick={() => handleImageClick('https://i.ibb.co/FzMMxdW/IMG-20240428-WA0006.jpg')} />
        <img src="https://i.ibb.co/K5Cq0GN/IMG-20240428-WA0007.jpg" className="img-responsive" onClick={() => handleImageClick('https://i.ibb.co/K5Cq0GN/IMG-20240428-WA0007.jpg')} />
        <img src="https://i.ibb.co/Jzj16Cw/IMG-20240428-WA0008.jpg" className="img-responsive" onClick={() => handleImageClick('https://i.ibb.co/Jzj16Cw/IMG-20240428-WA0008.jpg')} />
        <img src="https://i.ibb.co/THbKfdZ/IMG-20240428-WA0009.jpg" className="img-responsive" onClick={() => handleImageClick('https://i.ibb.co/THbKfdZ/IMG-20240428-WA0009.jpg')} />
        <img src="https://i.ibb.co/P16PHjw/IMG-20240428-WA0010.jpg" className="img-responsive" onClick={() => handleImageClick('https://i.ibb.co/P16PHjw/IMG-20240428-WA0010.jpg')} />
        <img src="https://i.ibb.co/bBKHHfr/IMG-20240428-WA0011.jpg" className="img-responsive" onClick={() => handleImageClick('https://i.ibb.co/bBKHHfr/IMG-20240428-WA0011.jpg')} />
        <img src="https://i.ibb.co/SNTthc4/IMG-20240428-WA0012.jpg" className="img-responsive" onClick={() => handleImageClick('https://i.ibb.co/SNTthc4/IMG-20240428-WA0012.jpg')} />
        <img src="https://i.ibb.co/7YnHVGN/IMG-20240428-WA0013.jpg" className="img-responsive" onClick={() => handleImageClick('https://i.ibb.co/7YnHVGN/IMG-20240428-WA0013.jpg')} />
        <img src="https://i.ibb.co/Ny5HZVK/IMG-20240428-WA0016.jpg" className="img-responsive" onClick={() => handleImageClick('https://i.ibb.co/Ny5HZVK/IMG-20240428-WA0016.jpg')} />
        <video className="vid" controls onClick={() => handleVideoClick(V1)}>
          <source src={V1} type="video/mp4" />
        </video>
        <video className="vid" controls onClick={() => handleVideoClick(V2)}>
          <source src={V2} type="video/mp4" />
        </video>
        <video className="vid" controls onClick={() => handleVideoClick(V3)}>
          <source src={V3} type="video/mp4" />
        </video>
        <video className="vid" controls onClick={() => handleVideoClick(V4)}>
          <source src={V4} type="video/mp4" />
        </video>
        <video className="vid" controls onClick={() => handleVideoClick(V5)}>
          <source src={V5} type="video/mp4" />
        </video>
      </div>
      
      <div id="myModal" className="modal" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <span className="close" onClick={closeModal}>&times;</span>
          <div className="modal-body">{modalContent}</div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
