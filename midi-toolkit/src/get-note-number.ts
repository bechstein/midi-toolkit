import { getType } from './get-type';
import { MessageType } from './types/message-type';

export function getNoteNumber(data: Uint8Array): number {
  const type = getType(data);
  if ((type === MessageType.NOTE_ON || type === MessageType.NOTE_OFF) && data.length > 1) {
    return data[1];
  } else return -1;
}
