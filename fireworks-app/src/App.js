import React, { useRef } from 'react'; // Added useRef
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three'; // Import THREE
import './App.css'; 

import City from './City.js';
import FireworksManager from './Fireworks.js';

function App() {
  const fireworksRef = useRef();

  const handleCanvasClick = (event) => {
    if (fireworksRef.current) {
      // For now, launch at a semi-random position in the sky
      // or a fixed point. Getting precise 3D click coordinates
      // requires raycasting, which can be added later.
      const clickX = (event.clientX / window.innerWidth) * 2 - 1;
      // const clickY = -(event.clientY / window.innerHeight) * 2 + 1; // clickY not used in current targetPosition

      // Create a vector for the click position (approximate)
      // This is a simplified way to get a world position from a click.
      // A proper way involves unprojecting with the camera.
      // Let's aim for a position in the distance above the city.
      const targetPosition = new THREE.Vector3(clickX * 30, 10 + Math.random() * 10, -20 + Math.random() * -20);


      fireworksRef.current.launchOneFirework(targetPosition);
    }
  };

  return (
    <Canvas 
        style={{ background: '#000011' }} 
        camera={{ position: [0, 30, 70], fov: 60 }} // Adjusted camera
        onClick={handleCanvasClick} // Add click handler
    >
      <ambientLight intensity={0.3} /> {/* Slightly dimmer ambient */}
      <pointLight position={[0, 50, 50]} intensity={0.8} />
      <pointLight position={[-50, 20, 50]} intensity={0.5} color="blue" />
      
      <City />
      <FireworksManager ref={fireworksRef} /> {/* Pass the ref */}
      
      <OrbitControls 
        minDistance={10} maxDistance={200} 
        target={[0, 5, 0]} /* Target the base of the city */
      />
    </Canvas>
  );
}

export default App;
