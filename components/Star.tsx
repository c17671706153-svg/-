import React, { useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { AppState } from '../types';
import { TREE_HEIGHT } from '../constants';
import { COLORS } from '../constants';

interface StarProps {
  appState: AppState;
  onClick: () => void; // For note viewer
  onMusicToggle?: () => void; // For music toggle
}

export const Star: React.FC<StarProps> = ({ appState, onClick, onMusicToggle }) => {
  const starRef = useRef<THREE.Group>(null);
  const rotationRef = useRef(0);

  // Always call useFrame, but only update if in FORM mode
  useFrame((state, delta) => {
    if (!starRef.current) return;
    
    // Only animate in FORM mode
    if (appState !== AppState.TREE_SHAPE) {
      // Hide star when not in FORM mode by setting scale to 0
      starRef.current.scale.set(0, 0, 0);
      return;
    }

    // Show star in FORM mode
    starRef.current.scale.set(1, 1, 1);

    // Rotate the star slowly
    rotationRef.current += delta * 0.5;
    starRef.current.rotation.z = rotationRef.current;

    // Gentle floating animation - use local position offset instead of absolute
    const time = state.clock.getElapsedTime();
    const floatOffset = Math.sin(time * 0.5) * 0.1;
    starRef.current.position.set(0, TREE_HEIGHT / 2 + 0.5 + floatOffset, 0);
  });

  // Always render, but control visibility via scale in useFrame

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // Only handle click in FORM mode
    if (appState === AppState.TREE_SHAPE) {
      // Toggle music if handler provided
      if (onMusicToggle) {
        onMusicToggle();
      }
      // Also open note viewer
      onClick();
    }
  };

  return (
    <group 
      ref={starRef}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'default';
      }}
    >
      {/* Star shape using octahedron geometry - vintage silver */}
      <mesh>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial 
          color="#C0C0C0"
          emissive="#E8E8E8"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>
      
      {/* Glow effect - larger transparent star */}
      <mesh>
        <octahedronGeometry args={[1.0, 0]} />
        <meshStandardMaterial 
          color="#C0C0C0"
          emissive="#E8E8E8"
          emissiveIntensity={0.15}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

