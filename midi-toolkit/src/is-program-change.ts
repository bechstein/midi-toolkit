import { getType } from './get-type';
import { MessageType } from './types/message-type';

export function isProgramChange(data: Uint8Array): boolean {
  const type = getType(data);
  return type === MessageType.PROGRAM_CHANGE;
}
