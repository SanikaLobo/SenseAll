// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import AOS from 'aos';
import 'aos/dist/aos.css';

// eslint-disable-next-line react/prop-types
function Counting({ n }) {
  useEffect(() => {
    AOS.init();
  }, []);

  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  const formattedNumber = number.interpolate((val) => {
    return val.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  });

  return (
    <animated.div data-aos="fade-up">{formattedNumber}</animated.div>
  );
}

export default Counting;
