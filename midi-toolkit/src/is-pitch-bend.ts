import { getType } from './get-type';
import { MessageType } from './types/message-type';

export function isPitchBend(data: Uint8Array): boolean {
  const type = getType(data);
  return type === MessageType.PITCH_BEND;
}
