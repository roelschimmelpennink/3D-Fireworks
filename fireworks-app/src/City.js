import React from 'react';

function City() {
  const buildings = [];
  const gridSize = 10;
  const spacing = 5; // Spacing between buildings
  const groundSize = gridSize * spacing;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const height = Math.random() * 10 + 1; // Random height between 1 and 11
      buildings.push(
        <mesh
          key={`${i}-${j}`}
          position={[
            (i - gridSize / 2) * spacing,
            height / 2, // Position so base is at y=0
            (j - gridSize / 2) * spacing,
          ]}
        >
          <boxGeometry args={[4, height, 4]} /> {/* Width, Height, Depth */}
          <meshStandardMaterial color="grey" />
        </mesh>
      );
    }
  }

  return (
    <group>
      {/* Optional: Add a ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[groundSize, groundSize]} />
        <meshStandardMaterial color="dimgray" />
      </mesh>
      {buildings}
    </group>
  );
}

export default City;
