import { isNoteOff } from './is-note-off';
import { getType } from './get-type';
import { getVelocity } from './get-velocity';
import { MessageType } from './types/message-type';

jest.mock('./get-type', () => ({
  getType: jest.fn(),
}));

jest.mock('./get-velocity', () => ({
  getVelocity: jest.fn(),
}));

describe('isNoteOff', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return true for a valid Note Off message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_OFF);

    const result = isNoteOff(new Uint8Array([128, 60, 0]));
    expect(result).toBe(true);
  });

  test('should return true for a Note On message with zero velocity', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);
    (getVelocity as jest.Mock).mockReturnValue(0);

    const result = isNoteOff(new Uint8Array([144, 60, 0]));
    expect(result).toBe(true);
  });

  test('should return false for a Note On message with non-zero velocity', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);
    (getVelocity as jest.Mock).mockReturnValue(100);

    const result = isNoteOff(new Uint8Array([144, 60, 100]));
    expect(result).toBe(false);
  });

  test('should return false for a Control Change message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);

    const result = isNoteOff(new Uint8Array([176, 7, 100]));
    expect(result).toBe(false);
  });

  test('should return false for an unknown message type', () => {
    (getType as jest.Mock).mockReturnValue(999);

    const result = isNoteOff(new Uint8Array([144, 60, 100]));
    expect(result).toBe(false);
  });

  test('should return false when getVelocity returns an invalid value for Note On', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);
    (getVelocity as jest.Mock).mockReturnValue(-1);

    const result = isNoteOff(new Uint8Array([144, 60, 100]));
    expect(result).toBe(false);
  });
});
