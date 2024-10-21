import { getStatusByte } from './get-status-byte';

export function getType(data: Uint8Array): number {
  return (getStatusByte(data) >> 4) & 0x0f;
}
