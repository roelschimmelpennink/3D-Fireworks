import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import City from './City.js';
import Fireworks from './Fireworks.js';

const Scene = () => {
  const [triggerFireworks, setTriggerFireworks] = useState(false);

  const handleCanvasClick = (event) => {
    console.log('Canvas clicked at:', event.point);
    setTriggerFireworks(true);
  };

  return (
    <Canvas onPointerDown={handleCanvasClick}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Stars />
      <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={75} />
      <City />
      <OrbitControls />
      {triggerFireworks && <Fireworks onLaunch={() => setTriggerFireworks(false)} />}
    </Canvas>
  );
};

export default Scene;
