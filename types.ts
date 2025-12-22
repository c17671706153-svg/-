export enum AppState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

export interface PositionData {
  scatter: [number, number, number];
  tree: [number, number, number];
  scale: number;
  rotation: [number, number, number];
}

export interface ParticleSystemProps {
  mode: AppState;
}