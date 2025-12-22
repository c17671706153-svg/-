import React, { Suspense } from 'react';
import { OrbitControls, Sparkles, PerspectiveCamera, Stars, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { TreeGroupExport } from './TreeGroupExport';
import { Star } from './Star';
import { AppState } from '../types';
import { COLORS } from '../constants';

interface ExperienceExportProps {
  appState: AppState;
  onStarClick?: () => void;
  onStarMusicToggle?: () => void;
}

export const ExperienceExport: React.FC<ExperienceExportProps> = ({ appState, onStarClick, onStarMusicToggle }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 35]} fov={50} />
      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={10} 
        maxDistance={50}
        autoRotate={appState === AppState.TREE_SHAPE}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5} 
      />

      {/* Lighting */}
      <ambientLight intensity={0.2} color={COLORS.emerald} />
      <pointLight position={[10, 10, 10]} intensity={1} color={COLORS.gold} />
      <pointLight position={[-10, 5, -10]} intensity={1} color="#ffffff" />
      <spotLight 
        position={[0, 20, 0]} 
        angle={0.5} 
        penumbra={1} 
        intensity={2} 
        color={COLORS.gold} 
        castShadow 
      />
      <spotLight position={[0, -10, 5]} intensity={1.5} color={COLORS.emeraldLight} />

      {/* Environment */}
      <Suspense fallback={null}>
        <Environment preset="city" blur={0.8} />
      </Suspense>

      {/* Scene Content - No photos on tree in export version */}
      <Suspense fallback={null}>
        <TreeGroupExport appState={appState} />
      </Suspense>

      {/* Star on top (only in FORM mode, outside TreeGroup to avoid rotation conflicts) */}
      {onStarClick && (
        <Star appState={appState} onClick={onStarClick} onMusicToggle={onStarMusicToggle} />
      )}

      {/* Background Ambience */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles 
        count={200} 
        scale={20} 
        size={4} 
        speed={0.4} 
        opacity={0.5} 
        color={COLORS.gold}
      />

      {/* Post Processing */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.6}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  );
};



