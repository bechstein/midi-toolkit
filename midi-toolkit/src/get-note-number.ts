import { getType } from './get-type';
import { MessageType } from './types/message-type';
import { InvalidMIDIMessageError } from './error/invalid-midi-message-error';

/**
 * @throws {Error}
 */
export function getNoteNumber(data: Uint8Array): number {
  if (data.length < 2) {
    throw new InvalidMIDIMessageError('InvalidMIDIDataError', 'MIDI data is too short to contain a note number.', data);
  }

  const type = getType(data);
  if (type === MessageType.NOTE_ON || type === MessageType.NOTE_OFF) {
    return data[1];
  } else {
    throw new InvalidMIDIMessageError(
      'UnsupportedMIDIMessageError',
      'MIDI message is neither NOTE_ON nor NOTE_OFF.',
      type
    );
  }
}
