import { getControllerNumber } from './get-controller-number';

export function getNoteNumber(data: Uint8Array): number {
  return getControllerNumber(data);
}
