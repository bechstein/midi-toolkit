import { getType } from './get-type';
import { MessageType } from './types/message-type';

export function isPolyphonicAftertouch(data: Uint8Array): boolean {
  const type = getType(data);
  return type === MessageType.POLYPHONIC_AFTERTOUCH;
}
