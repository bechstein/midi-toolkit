import { getType } from './get-type';
import { MessageType } from './types/message-type';
import { getVelocity } from './get-velocity';

export function isNoteOff(data: Uint8Array): boolean {
  const type = getType(data);
  const velocity = getVelocity(data);
  return type === MessageType.NOTE_OFF || (type === MessageType.NOTE_ON && velocity === 0);
}
