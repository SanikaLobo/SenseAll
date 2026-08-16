// eslint-disable-next-line no-unused-vars
import React from 'react';
import Vivek from './../../assets/Vivek.jpg';
import Rehan from './../../assets/Rehan.jpg';
import Rohit from './../../assets/Rohit.jpg';
import Nishi from './../../assets/Nishi.jpg';

import './../../css/card.css';

const About = () => {
  return (
    <>
    <div className="about_heading">
      About us
    </div>
    <div className="about-container">
      <div className="about-media">
        <div className="about-media-content-1">
          <p className='p'>Over 63 million people in India, or about 6.3% of the population, are hard of hearing. This group is expected to grow due to factors such as aging. Though they do not regard their hearing loss as a disability, but rather a different way of life, their social interactions can be significantly limited</p>
          <p className='p'>To prevent isolation within the often exclusive deaf community, we, the students of MH Saboo Siddik College of Engineering, affiliated with the University of Mumbai’s Computer Engineering Department, aim to bridge this communication gap using machine learning and computer vision techniques.</p>
        </div>
        <div className="media-illustration-1">
        <img src="https://i.ibb.co/bBKHHfr/IMG-20240428-WA0011.jpg"/>
        </div>
      </div>
      <div className="about-media">
      <div className="media-illustration-2">
        <img src="https://i.ibb.co/P16PHjw/IMG-20240428-WA0010.jpg"/>
        </div>
        <div className="about-media-content-2">
          <p className='p'>Our project focuses on creating a robust, scalable system to predict, interpret, and translate Indian Sign Language (ISL) in real-time, without requiring specialized hardware. ISL combines actions, facial expressions, and body language, differing from other sign languages like American Sign Language (ASL), which may use single-hand gestures; ISL usually uses both hands. This complexity presents challenges in developing an accurate machine learning model for ISL interpretation.</p>
          <p className='p'>For our third-year Mini Project, we began our research with a visit to the Bombay Institution For Deaf & Mutes. We initially gathered information about commonly used actions and words through the institution's teachers and developed a sequence-to-sequence model using GRU and Bidirectional GRU to capture the semantic meaning of actions. Our model worked well with a set of six actions, utilizing real-time data collected through landmarks from deaf and mute students.</p>
        </div>
      </div>
      <div className="about-media">
        <div className="about-media-content-1">
          <p className='p'>Subsequently, we explored various models including a 3D convolutional model working on video data, and a Time Distributed Conv model that processes multiple image frames to predict a single action. We also tested a ConvLSTM model, a combination of convolutional and LSTM networks, which showed high accuracy on the training set. However, these models were computationally intensive, required GPUs, and had difficulties distinguishing between similar actions like 'hello' and 'morning'.</p>
          <p className='p'>To create a more accessible solution, we started from scratch, building a new dataset of static actions frequently used in digital communication. We annotated these images and trained them using the MS COCO model. With the help of Roboflow, we were able to deploy our solution, ensuring real-time translation with low latency.</p>
          <p className='p'>Moving forward, we plan to enhance our model by integrating alphabets with actions to facilitate even smoother communication between hard-of-hearing individuals and others. This enhancement aims to make everyday interactions more accessible and inclusive, leveraging the power of web applications, which can be easily accessed from anywhere via the internet.</p>
        </div>
        <div className="media-illustration-1">
        <img src="https://i.ibb.co/K5Cq0GN/IMG-20240428-WA0007.jpg"/>
        </div>
      </div>
      <div className="about-media">
      <div className="media-illustration-2">
        <img src="https://i.ibb.co/Ny78szP/nicholas.jpg"/>
        </div>
        <div className="about-media-content-2">
          <p className='p'>I would like to extend my heartfelt thanks to Nicholas Renotte for his invaluable contributions to the field of artificial intelligence. His insightful videos on YouTube have been an integral part of my project journey, providing me with clear explanations and practical demonstrations. I've had the pleasure of implementing his models, and they have proven to be of great quality and utility. Moreover, his guidance through complex AI concepts has been superb, making difficult topics accessible and understandable. I am truly grateful for his dedication to educating and empowering aspiring AI enthusiasts like myself. For those interested, you can find his work and contributions on his GitHub account: <a href='https://github.com/nicknochnack'>Nicholas Renotte's GitHub.</a></p>
        </div>
      </div>
    </div>
    <div className="meet_heading">
    The Faces Behind Ishaara
    </div>
      <div className="row"> 
      <div className="card-client">
    <div className="user-picture">
      <img src={Rehan} alt="Team member" />
    </div>
    <p className="name-client"> Rehan Sayyed
        <span>Fullstack Developer
        </span>
    </p>
    <div className="social-media">
        <a href="https://twitter.com/RehanFerozSayy1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
            </svg>
            <span className="tooltip-social">Twitter</span>
        </a>
        <a href="https://www.instagram.com/mr_rehan__06/">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
            </svg>
            <span className="tooltip-social">Instagram</span>
        </a>
        <a href="https://github.com/rsayyed591/">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.385.6.11.793-.26.793-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.606-4.042-1.606-.546-1.386-1.333-1.755-1.333-1.755-1.087-.743.083-.728.083-.728 1.202.085 1.833 1.235 1.833 1.235 1.067 1.828 2.797 1.3 3.482.997.108-.768.42-1.3.763-1.6-2.677-.307-5.491-1.34-5.491-5.97 0-1.322.47-2.4 1.236-3.246-.123-.307-.536-1.535.116-3.2 0 0 1.013-.325 3.316 1.237a11.545 11.545 0 0 1 3-.4c1.018.004 2.04.136 3 .4 2.3-1.562 3.313-1.237 3.313-1.237.654 1.665.24 2.893.117 3.2.768.846 1.235 1.924 1.235 3.246 0 4.643-2.819 5.66-5.504 5.961.432.374.822 1.112.822 2.24 0 1.618-.015 2.923-.015 3.318 0 .32.192.693.8.576C20.565 21.794 24 17.296 24 12c0-6.627-5.373-12-12-12"></path>
</svg>
<span className="tooltip-social">GitHub</span>

        </a>
        <a href="https://www.linkedin.com/in/rehan42/">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
            </svg>
            <span className="tooltip-social">LinkedIn</span>
        </a>
    </div>
</div>
<div className="card-client">
    <div className="user-picture">
      <img src={Vivek} alt="Team member" />
    </div>
    <p className="name-client"> Vivek Chouhan
        <span>Fullstack Developer
        </span>
    </p>
    <div className="social-media">
        <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
            </svg>
            <span className="tooltip-social">Twitter</span>
        </a>
        <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
            </svg>
            <span className="tooltip-social">Instagram</span>
        </a>
        <a href="https://github.com/Viv696969">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.385.6.11.793-.26.793-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.606-4.042-1.606-.546-1.386-1.333-1.755-1.333-1.755-1.087-.743.083-.728.083-.728 1.202.085 1.833 1.235 1.833 1.235 1.067 1.828 2.797 1.3 3.482.997.108-.768.42-1.3.763-1.6-2.677-.307-5.491-1.34-5.491-5.97 0-1.322.47-2.4 1.236-3.246-.123-.307-.536-1.535.116-3.2 0 0 1.013-.325 3.316 1.237a11.545 11.545 0 0 1 3-.4c1.018.004 2.04.136 3 .4 2.3-1.562 3.313-1.237 3.313-1.237.654 1.665.24 2.893.117 3.2.768.846 1.235 1.924 1.235 3.246 0 4.643-2.819 5.66-5.504 5.961.432.374.822 1.112.822 2.24 0 1.618-.015 2.923-.015 3.318 0 .32.192.693.8.576C20.565 21.794 24 17.296 24 12c0-6.627-5.373-12-12-12"></path>
</svg>
<span className="tooltip-social">GitHub</span>
        </a>
        <a href="https://www.linkedin.com/in/vivek-chouhan/">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
            </svg>
            <span className="tooltip-social">LinkedIn</span>
        </a>
    </div>
</div>
<div className="card-client">
    <div className="user-picture">
      <img src={Nishi} alt="Team member" />
    </div>
    <p className="name-client"> Nishikant Raut
        <span>Fullstack Developer
        </span>
    </p>
    <div className="social-media">
        <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
            </svg>
            <span className="tooltip-social">Twitter</span>
        </a>
        <a href="https://www.instagram.com/nishiuwu?igsh=MzRlODBiNWFlZA==">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
            </svg>
            <span className="tooltip-social">Instagram</span>
        </a>
        <a href="https://github.com/Nishikant00">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.385.6.11.793-.26.793-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.606-4.042-1.606-.546-1.386-1.333-1.755-1.333-1.755-1.087-.743.083-.728.083-.728 1.202.085 1.833 1.235 1.833 1.235 1.067 1.828 2.797 1.3 3.482.997.108-.768.42-1.3.763-1.6-2.677-.307-5.491-1.34-5.491-5.97 0-1.322.47-2.4 1.236-3.246-.123-.307-.536-1.535.116-3.2 0 0 1.013-.325 3.316 1.237a11.545 11.545 0 0 1 3-.4c1.018.004 2.04.136 3 .4 2.3-1.562 3.313-1.237 3.313-1.237.654 1.665.24 2.893.117 3.2.768.846 1.235 1.924 1.235 3.246 0 4.643-2.819 5.66-5.504 5.961.432.374.822 1.112.822 2.24 0 1.618-.015 2.923-.015 3.318 0 .32.192.693.8.576C20.565 21.794 24 17.296 24 12c0-6.627-5.373-12-12-12"></path>
</svg>
<span className="tooltip-social">GitHub</span>

        </a>
        <a href="https://www.linkedin.com/in/nishidev/">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
            </svg>
            <span className="tooltip-social">LinkedIn</span>
        </a>
    </div>
</div>
<div className="card-client">
    <div className="user-picture">
      <img src={Rohit} alt="Team member" />
    </div>
    <p className="name-client"> Rohit Deshmukh
        <span>Fullstack Developer
        </span>
    </p>
    <div className="social-media">
        <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
            </svg>
            <span className="tooltip-social">Twitter</span>
        </a>
        <a href="https://www.instagram.com/__._.rohit_.__/">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
            </svg>
            <span className="tooltip-social">Instagram</span>
        </a>
        <a href="https://github.com/ardie0727">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.385.6.11.793-.26.793-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.606-4.042-1.606-.546-1.386-1.333-1.755-1.333-1.755-1.087-.743.083-.728.083-.728 1.202.085 1.833 1.235 1.833 1.235 1.067 1.828 2.797 1.3 3.482.997.108-.768.42-1.3.763-1.6-2.677-.307-5.491-1.34-5.491-5.97 0-1.322.47-2.4 1.236-3.246-.123-.307-.536-1.535.116-3.2 0 0 1.013-.325 3.316 1.237a11.545 11.545 0 0 1 3-.4c1.018.004 2.04.136 3 .4 2.3-1.562 3.313-1.237 3.313-1.237.654 1.665.24 2.893.117 3.2.768.846 1.235 1.924 1.235 3.246 0 4.643-2.819 5.66-5.504 5.961.432.374.822 1.112.822 2.24 0 1.618-.015 2.923-.015 3.318 0 .32.192.693.8.576C20.565 21.794 24 17.296 24 12c0-6.627-5.373-12-12-12"></path>
</svg>
<span className="tooltip-social">GitHub</span>

        </a>
        <a href="https://www.linkedin.com/in/rohit-deshmukh-/">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
            </svg>
            <span className="tooltip-social">LinkedIn</span>
        </a>
    </div>
</div>
</div>
</>
  );
}

export default About;
