import { getControllerValue } from './get-controller-value';

export function getVelocity(data: Uint8Array): number {
  return getControllerValue(data);
}
