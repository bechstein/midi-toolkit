import { getType } from './get-type';
import { MessageType } from './types/message-type';

export function getVelocity(data: Uint8Array): number {
  const type = getType(data);
  if ((type === MessageType.NOTE_ON || type === MessageType.NOTE_OFF) && data.length > 2) {
    return data[2];
  } else return -1;
}
