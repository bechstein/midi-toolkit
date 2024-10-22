import { isPolyphonicAftertouch } from './is-polyphonic-aftertouch';
import { getType } from './get-type';
import { MessageType } from './types/message-type';

jest.mock('./get-type', () => ({
  getType: jest.fn(),
}));

describe('isPolyphonicAftertouch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return true for a Polyphonic Aftertouch message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.POLYPHONIC_AFTERTOUCH);

    const result = isPolyphonicAftertouch(new Uint8Array([160, 60, 100]));
    expect(result).toBe(true);
  });

  test('should return false for a Note On message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);

    const result = isPolyphonicAftertouch(new Uint8Array([144, 60, 100]));
    expect(result).toBe(false);
  });

  test('should return false for a Control Change message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);

    const result = isPolyphonicAftertouch(new Uint8Array([176, 7, 100]));
    expect(result).toBe(false);
  });

  test('should return false for a Program Change message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.PROGRAM_CHANGE);

    const result = isPolyphonicAftertouch(new Uint8Array([192, 10]));
    expect(result).toBe(false);
  });

  test('should return false for a Note Off message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_OFF);

    const result = isPolyphonicAftertouch(new Uint8Array([128, 60, 100]));
    expect(result).toBe(false);
  });

  test('should return false when getType returns an unknown message type', () => {
    (getType as jest.Mock).mockReturnValue(999);

    const result = isPolyphonicAftertouch(new Uint8Array([0x00]));
    expect(result).toBe(false);
  });
});
