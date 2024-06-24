import { MidiMessageType } from './midi-message-type';

export interface MidiNoteOffMessage {
  type: MidiMessageType.NOTE_OFF;
  channel: number;
  key: number;
  velocity: number;
}
