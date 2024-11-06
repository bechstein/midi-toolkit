import { InvalidMIDIMessageError } from '../error/invalid-midi-message-error';
import { generateStatusByte } from '../generate-status-byte';
import { MessageType } from '../types/message-type';

/**
 * @throws {Error}
 */
export function generateNote(type: MessageType, channel: number, note: number, velocity: number): Uint8Array {
  if (note < 0 || note > 127) {
    throw new InvalidMIDIMessageError('InvalidNoteError', 'Note is out of range.', note);
  }
  if (velocity < 0 || velocity > 127) {
    throw new InvalidMIDIMessageError('InvalidVelocityError', 'Velocity is out of range.', velocity);
  }

  const statusByte = generateStatusByte(type, channel);
  return Uint8Array.from([statusByte, note, velocity]);
}
