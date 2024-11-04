import { getType } from './get-type';
import { MessageType } from './types/message-type';
import { getVelocity } from './get-velocity';
import { InvalidMIDIMessageError } from './error/invalid-midi-message-error';

/**
 * @throws {Error}
 */
export function getHighResVelocity(data: Uint8Array, lsb: number): number {
  const type = getType(data);
  if (type === MessageType.NOTE_ON || type === MessageType.NOTE_OFF) {
    const velocity = getVelocity(data);
    return (velocity << 7) | lsb;
  } else {
    throw new InvalidMIDIMessageError(
      'UnsupportedMIDIMessageError',
      'MIDI message is neither NOTE_ON nor NOTE_OFF.',
      type
    );
  }
}
