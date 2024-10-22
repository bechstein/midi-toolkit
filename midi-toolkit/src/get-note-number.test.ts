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

  test('should return -1 for a Control Change message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);

    const result = getNoteNumber(new Uint8Array([176, 7, 100]));
    expect(result).toBe(-1);
  });

  test('should return -1 for a Program Change message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.PROGRAM_CHANGE);

    const result = getNoteNumber(new Uint8Array([192, 10]));
    expect(result).toBe(-1);
  });

  test('should return -1 for an incomplete Note On message (missing second byte)', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);

    const result = getNoteNumber(new Uint8Array([144]));
    expect(result).toBe(-1);
  });

  test('should return the note number even if velocity is missing (incomplete data)', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);

    const result = getNoteNumber(new Uint8Array([144, 60]));
    expect(result).toBe(60);
  });

  test('should return -1 for an unknown message type', () => {
    (getType as jest.Mock).mockReturnValue(999);

    const result = getNoteNumber(new Uint8Array([144, 60, 100]));
    expect(result).toBe(-1);
  });

  test('should return -1 for invalid or empty data', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);

    const result = getNoteNumber(new Uint8Array([]));
    expect(result).toBe(-1);
  });
});
