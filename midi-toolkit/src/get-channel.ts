import { getStatusByte } from './get-status-byte';

export function getChannel(data: Uint8Array): number {
  const statusByte = getStatusByte(data);
  if ((statusByte >= 0xf0 && statusByte <= 0xff) || statusByte < 0) {
    // 240 to 255
    return -1;
  } else return (statusByte & 0x0f) + 1;
}
