import { getStatusByte } from './get-status-byte';

/**
 * @throws {Error}
 */
export function getType(data: Uint8Array): number {
  const statusByte = getStatusByte(data);
  return (statusByte >> 4) & 0x0f;
}
