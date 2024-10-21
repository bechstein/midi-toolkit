import { getStatusByte } from './get-status-byte';

export function getChannel(data: Uint8Array): number {
  return (getStatusByte(data) & 0x0f) + 1;
}
