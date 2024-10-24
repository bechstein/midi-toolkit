import { MessageType } from './types/message-type';
import { generateNote } from './utils/generate-note';

export function generateNoteOn(channel: number, note: number, velocity: number): Uint8Array {
  return generateNote(MessageType.NOTE_ON, channel, note, velocity);
}
