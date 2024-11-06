import { MessageType } from './types/message-type';
import { generateNote } from './utils/generate-note';

export function generateNoteOff(channel: number, note: number, velocity: number): Uint8Array {
  return generateNote(MessageType.NOTE_OFF, channel, note, velocity);
}
