import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AppState } from '../types';
import { InstancedParticles } from './Particles';
import { SnowParticles } from './SnowParticles'; // Import new component
import { PhotoGallery } from './PhotoGallery';
import { NEEDLE_COUNT, ORNAMENT_COUNT, SNOWFLAKE_COUNT, STOCKING_COUNT, CANDY_COUNT, GIFT_COUNT, COLORS } from '../constants';

interface TreeGroupProps {
  appState: AppState;
}

export const TreeGroup: React.FC<TreeGroupProps> = ({ appState }) => {
  const groupRef = useRef<THREE.Group>(null);
  const rotationProgress = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Track rotation progress based on appState
    const targetProgress = appState === AppState.TREE_SHAPE ? 1 : 0;
    rotationProgress.current = THREE.MathUtils.lerp(
      rotationProgress.current,
      targetProgress,
      delta * 2.5
    );

    // Rotate the entire tree group (including photos) when in FORM mode
    if (rotationProgress.current > 0.8) {
      groupRef.current.rotation.y += delta * 0.1 * rotationProgress.current;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Emerald Needles */}
      <InstancedParticles
        mode={appState}
        count={NEEDLE_COUNT}
        type="needle"
        color={COLORS.emeraldLight}
      />

      {/* Gold Ornaments */}
      <InstancedParticles
        mode={appState}
        count={ORNAMENT_COUNT}
        type="ornament"
        color={COLORS.gold}
        emissive={COLORS.goldDark}
        emissiveIntensity={0.5}
      />

      {/* Snowflakes - Dedicated Component */}
      <SnowParticles mode={appState} count={SNOWFLAKE_COUNT} />

      {/* Decorations */}
      <InstancedParticles mode={appState} count={STOCKING_COUNT} type="stocking" color="#ffffff" />
      <InstancedParticles mode={appState} count={CANDY_COUNT} type="candy" color="#ffffff" />
      <InstancedParticles mode={appState} count={GIFT_COUNT} type="gift" color="#ffffff" />

      {/* Polaroid Photo Gallery */}
      <PhotoGallery appState={appState} />
    </group>
  );
};
