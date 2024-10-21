import { getControllerValue } from './get-controller-value';

export function getHighResVelocity(data: Uint8Array, lsb: number): number {
  const controllerValue = getControllerValue(data);
  return (controllerValue << 7) | lsb;
}
