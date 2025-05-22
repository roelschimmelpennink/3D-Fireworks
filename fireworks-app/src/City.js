import React from 'react';

const City = () => {
  const buildings = [
    { id: 1, args: [2, 5, 2], color: '#555555', position: [-5, 2.5, 0] },
    { id: 2, args: [3, 7, 3], color: '#666666', position: [0, 3.5, -2] },
    { id: 3, args: [2.5, 6, 2.5], color: '#777777', position: [5, 3, 1] },
    { id: 4, args: [2, 4, 2], color: '#5A5A5A', position: [-2, 2, -5] },
    { id: 5, args: [3, 8, 3], color: '#707070', position: [3, 4, -4] },
  ];

  return (
    <group>
      {buildings.map((building) => (
        <mesh key={building.id} position={building.position}>
          <boxGeometry args={building.args} />
          <meshStandardMaterial color={building.color} />
        </mesh>
      ))}
    </group>
  );
};

export default City;
