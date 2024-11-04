import { getType } from './get-type';
import { MessageType } from './types/message-type';

export function isChannelAftertouch(data: Uint8Array): boolean {
  const type = getType(data);
  return type === MessageType.CHANNEL_AFTERTOUCH;
}
