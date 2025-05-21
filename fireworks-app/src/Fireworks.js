import React, { useState, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const initialParticleColor = new THREE.Color('gold');

// Manages a single firework effect (launch + explosion)
function SingleFireworkEffect({ initialPosition, onComplete }) {
  const [particles, setParticles] = useState([]);
  const effectPhase = useRef('launching'); // launching, exploding
  const launchFuel = useRef(Math.random() * 5 + 3); 
  const rocketRef = useRef({
    position: new THREE.Vector3().copy(initialPosition),
    velocity: new THREE.Vector3(0, Math.random() * 0.2 + 0.2, 0), 
  });

  useFrame((state, delta) => {
    const effectiveDelta = delta * 2; // Speed up simulation a bit

    if (effectPhase.current === 'launching') {
      rocketRef.current.position.addScaledVector(rocketRef.current.velocity, effectiveDelta * 30);
      launchFuel.current -= effectiveDelta;

      setParticles(prev => [
        ...prev,
        {
          id: Math.random(),
          position: new THREE.Vector3().copy(rocketRef.current.position),
          velocity: new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1),
          color: initialParticleColor,
          lifespan: Math.random() * 0.5 + 0.3,
          age: 0,
          size: Math.random() * 0.2 + 0.1,
        }
      ]);

      if (launchFuel.current <= 0) {
        effectPhase.current = 'exploding';
        const explosionParticles = [];
        const numExplosionParticles = 50 + Math.floor(Math.random() * 50);
        for (let i = 0; i < numExplosionParticles; i++) {
          const velocity = new THREE.Vector3(
            (Math.random() - 0.5),
            (Math.random() - 0.5),
            (Math.random() - 0.5)
          ).normalize().multiplyScalar(Math.random() * 3 + 1);

          explosionParticles.push({
            id: Math.random(),
            position: new THREE.Vector3().copy(rocketRef.current.position),
            velocity: velocity,
            color: initialParticleColor.clone().multiplyScalar(Math.random() * 0.5 + 0.5),
            lifespan: Math.random() * 1 + 0.5,
            age: 0,
            size: Math.random() * 0.3 + 0.1,
          });
        }
        setParticles(prev => [...prev, ...explosionParticles]);
      }
    }

    setParticles(prev =>
      prev
        .map(p => {
          const newPosition = p.position.clone().addScaledVector(p.velocity, effectiveDelta);
          const newVelocity = p.velocity.clone();
          newVelocity.y -= 0.05 * effectiveDelta * 30; // Adjusted gravity
          return { ...p, position: newPosition, velocity: newVelocity, age: p.age + effectiveDelta };
        })
        .filter(p => p.age < p.lifespan)
    );

    if (effectPhase.current === 'exploding' && particles.length === 0 && launchFuel.current <=0) {
        if(onComplete) onComplete();
    }
  });

  return (
    <group>
      {particles.map(p => (
        <mesh key={p.id} position={p.position}>
          <sphereGeometry args={[p.size * Math.max(0,(1 - p.age/p.lifespan)), 8, 8]} />
          <meshBasicMaterial color={p.color} transparent opacity={Math.max(0, 1 - p.age / p.lifespan)} />
        </mesh>
      ))}
    </group>
  );
}

const FireworksManager = forwardRef((props, ref) => { // Added forwardRef
    const [activeFireworks, setActiveFireworks] = useState([]);

    const launchFirework = useCallback((position = new THREE.Vector3(0,10,0)) => { // Default launch height
        const id = Math.random();
        const launchPos = position.clone().add(new THREE.Vector3( (Math.random() - 0.5) * 30, 0, (Math.random() - 0.5) * 30));
        setActiveFireworks(prev => [...prev, {id, initialPosition: launchPos}]);
    }, []);

    const handleFireworkComplete = useCallback((id) => {
        setActiveFireworks(prev => prev.filter(fw => fw.id !== id));
    }, []);

    useImperativeHandle(ref, () => ({ // Expose launchFirework
        launchOneFirework: (pos) => {
            launchFirework(pos);
        }
    }));

  return (
    <>
      {activeFireworks.map(fw => (
        <SingleFireworkEffect
          key={fw.id}
          initialPosition={fw.initialPosition}
          onComplete={() => handleFireworkComplete(fw.id)}
        />
      ))}
    </>
  );
});
export default FireworksManager;
