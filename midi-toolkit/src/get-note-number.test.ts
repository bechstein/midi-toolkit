import { getNoteNumber } from './get-note-number';
import { getType } from './get-type';
import { MessageType } from './types/message-type';

jest.mock('./get-type', () => ({
  getType: jest.fn(),
}));

describe('getNoteNumber', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return the note number for a valid Note On message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);

    const result = getNoteNumber(new Uint8Array([144, 60, 100]));
    expect(result).toBe(60);
  });

  test('should return the note number for a valid Note Off message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_OFF);

    const result = getNoteNumber(new Uint8Array([128, 60, 100]));
    expect(result).toBe(60);
  });

  test('should throw error for a Control Change message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);
    expect(() => getNoteNumber(new Uint8Array([176, 7, 100]))).toThrow();
  });

  test('should throw error for a Program Change message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.PROGRAM_CHANGE);
    expect(() => getNoteNumber(new Uint8Array([192, 10]))).toThrow();
  });

  test('should throw error for an incomplete Note On message (missing second byte)', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);
    expect(() => getNoteNumber(new Uint8Array([144]))).toThrow();
  });

  test('should return the note number even if velocity is missing (incomplete data)', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);

    const result = getNoteNumber(new Uint8Array([144, 60]));
    expect(result).toBe(60);
  });

  test('should throw error for an unknown message type', () => {
    (getType as jest.Mock).mockReturnValue(999);
    expect(() => getNoteNumber(new Uint8Array([144, 60, 100]))).toThrow();
  });

  test('should throw error for invalid or empty data', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);
    expect(() => getNoteNumber(new Uint8Array([]))).toThrow();
  });
});
