import { getType } from './get-type';
import { MessageType } from './types/message-type';
import { getVelocity } from './get-velocity';

export function getHighResVelocity(data: Uint8Array, lsb: number): number {
  const type = getType(data);
  if (type === MessageType.NOTE_ON || type === MessageType.NOTE_OFF) {
    const velocity = getVelocity(data);
    if (velocity < 0) {
      return -1;
    } else return (velocity << 7) | lsb;
  } else return -1;
}
