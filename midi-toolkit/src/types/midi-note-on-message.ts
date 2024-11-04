export interface MidiNoteOnMessage {
  type: 144;
  channel: number;
  key: number;
  velocity: number;
}
