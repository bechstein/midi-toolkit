import { MidiMessageType } from './midi-message-type';

export interface MidiNoteOnMessage {
  type: MidiMessageType.NOTE_ON;
  channel: number;
  key: number;
  velocity: number;
}
