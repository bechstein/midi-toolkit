import { generateStatusByte } from './generate-status-byte';
import { MessageType } from './types/message-type';

describe('generateStatusByte', () => {
  test('should generate correct status byte for Note On on channel 1', () => {
    const result = generateStatusByte(MessageType.NOTE_ON, 1);
    expect(result).toBe(0x90);
  });

  test('should generate correct status byte for Note Off on channel 1', () => {
    const result = generateStatusByte(MessageType.NOTE_OFF, 1);
    expect(result).toBe(0x80);
  });

  test('should generate correct status byte for Control Change on channel 16', () => {
    const result = generateStatusByte(MessageType.CONTROL_CHANGE, 16);
    expect(result).toBe(0xbf);
  });

  test('should generate correct status byte for Pitch Bend on channel 10', () => {
    const result = generateStatusByte(MessageType.PITCH_BEND, 10);
    expect(result).toBe(0xe9);
  });

  test('should throw an error for invalid channel (0)', () => {
    expect(() => generateStatusByte(MessageType.NOTE_ON, 0)).toThrow();
  });

  test('should throw an error for invalid channel (17)', () => {
    expect(() => generateStatusByte(MessageType.NOTE_ON, 17)).toThrow();
  });

  test('should generate correct status byte for Program Change on channel 5', () => {
    const result = generateStatusByte(MessageType.PROGRAM_CHANGE, 5);
    expect(result).toBe(0xc4);
  });

  test('should generate correct status byte for Channel Aftertouch on channel 2', () => {
    const result = generateStatusByte(MessageType.CHANNEL_AFTERTOUCH, 2);
    expect(result).toBe(0xd1);
  });

  test('should generate correct status byte for Polyphonic Aftertouch on channel 3', () => {
    const result = generateStatusByte(MessageType.POLYPHONIC_AFTERTOUCH, 3);
    expect(result).toBe(0xa2);
  });
});
