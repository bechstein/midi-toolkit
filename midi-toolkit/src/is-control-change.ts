import { getType } from './get-type';
import { MessageType } from './types/message-type';

export function isControlChange(data: Uint8Array): boolean {
  const type = getType(data);
  return type === MessageType.CONTROL_CHANGE;
}
