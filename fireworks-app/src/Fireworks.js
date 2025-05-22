import React, { useEffect } from 'react';
import { Howl } from 'howler';

const Fireworks = ({ onLaunch }) => {
  const launchFirework = () => {
    console.log("Placeholder firework launched with sound!");
    
    const sound = new Howl({
      src: ['https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg'],
      html5: true // Optional: Force HTML5 Audio, good for broader compatibility with some servers/formats
    });
    sound.play();

    if (onLaunch) {
      onLaunch();
    }
  };

  useEffect(() => {
    launchFirework();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return null; // This component doesn't render anything visual itself
};

export default Fireworks;
