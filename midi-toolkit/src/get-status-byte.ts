import { InvalidMIDIMessageError } from './error/invalid-midi-message-error';

/**
 * @throws {Error}
 */
export function getStatusByte(data: Uint8Array): number {
  if (data.length < 1) {
    throw new InvalidMIDIMessageError('InvalidMIDIDataError', 'MIDI data is too short to contain a status byte.', data);
  } else return data[0];
}
