import { MessageType } from './types/message-type';
import { InvalidMIDIMessageError } from './error/invalid-midi-message-error';

/**
 * @throws {Error}
 */
export function generateStatusByte(type: MessageType, channel: number): number {
  if (channel < 1 || channel > 16) {
    throw new InvalidMIDIMessageError('InvalidChannelError', 'Channel is out of range (1-16).', channel);
  }
  return (type << 4) | (channel - 1);
}
