export enum MessageType {
  NOTE_OFF = 0x8,
  NOTE_ON = 0x9,
  POLYPHONIC_AFTERTOUCH = 0xa,
  CONTROL_CHANGE = 0xb,
  PITCH_BEND = 0xe,
  PROGRAM_CHANGE = 0xc,
  CHANNEL_AFTERTOUCH = 0xd,
  SYSEX = 0x0f,
}
