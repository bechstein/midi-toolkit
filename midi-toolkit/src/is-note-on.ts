import { getType } from './get-type';
import { MessageType } from './types/message-type';
import { getControllerValue } from './get-controller-value';

export function isNoteOn(data: Uint8Array): boolean {
  const type = getType(data);
  const velocity = getControllerValue(data);
  return type === MessageType.NOTE_ON && velocity > 0;
}
