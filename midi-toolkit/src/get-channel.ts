import { getStatusByte } from './get-status-byte';

export function getChannel(data: Uint8Array): number {
  const statusByte = getStatusByte(data);
  if (isNaN(statusByte)) throw new Error(`Unexpected status byte: ${statusByte}`);
  return (statusByte & 0x0f) + 1;
}
