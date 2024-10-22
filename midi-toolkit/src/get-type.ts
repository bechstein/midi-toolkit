import { getStatusByte } from './get-status-byte';

export function getType(data: Uint8Array): number {
  const statusByte = getStatusByte(data);
  if (statusByte < 0) {
    return -1;
  } else return (statusByte >> 4) & 0x0f;
}
