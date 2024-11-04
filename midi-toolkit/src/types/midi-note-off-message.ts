export interface MidiNoteOffMessage {
  type: 128;
  channel: number;
  key: number;
  velocity: number;
}
