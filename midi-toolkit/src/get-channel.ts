import { getStatusByte } from './get-status-byte';
import { getType } from './get-type';
import { MessageType } from './types/message-type';
import { InvalidMIDIMessageError } from './error/invalid-midi-message-error';

/**
 * @throws {Error}
 */
export function getChannel(data: Uint8Array): number {
  const type = getType(data);
  if (type === MessageType.SYSEX) {
    throw new InvalidMIDIMessageError(
      'UnsupportedMIDIMessageError',
      'Cannot get channel for System Exclusive messages.',
      type
    );
  } else {
    const statusByte = getStatusByte(data);
    return (statusByte & 0x0f) + 1;
  }
}
