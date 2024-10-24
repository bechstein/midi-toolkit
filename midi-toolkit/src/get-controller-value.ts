import { getType } from './get-type';
import { MessageType } from './types/message-type';
import { InvalidMIDIMessageError } from './error/invalid-midi-message-error';

/**
 * @throws {Error}
 */
export function getControllerValue(data: Uint8Array): number {
  const type = getType(data);
  if (type !== MessageType.CONTROL_CHANGE) {
    throw new InvalidMIDIMessageError(
      'UnsupportedMIDIMessageError',
      'MIDI message is not a Control Change message.',
      type
    );
  }
  if (data.length <= 2) {
    throw new InvalidMIDIMessageError(
      'InvalidMIDIDataError',
      'MIDI data is too short to contain a controller value.',
      data
    );
  }
  return data[2];
}
