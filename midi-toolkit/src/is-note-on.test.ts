import { isNoteOn } from './is-note-on';
import { getType } from './get-type';
import { getVelocity } from './get-velocity';
import { MessageType } from './types/message-type';

jest.mock('./get-type', () => ({
  getType: jest.fn(),
}));

jest.mock('./get-velocity', () => ({
  getVelocity: jest.fn(),
}));

describe('isNoteOn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return true for a valid Note On message with velocity > 0', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);
    (getVelocity as jest.Mock).mockReturnValue(100);

    const result = isNoteOn(new Uint8Array([144, 60, 100]));
    expect(result).toBe(true);
  });

  test('should return false for a Note On message with zero velocity', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);
    (getVelocity as jest.Mock).mockReturnValue(0);

    const result = isNoteOn(new Uint8Array([144, 60, 0]));
    expect(result).toBe(false);
  });

  test('should return false for a Note Off message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_OFF);

    const result = isNoteOn(new Uint8Array([128, 60, 100]));
    expect(result).toBe(false);
  });

  test('should return false for a Control Change message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);

    const result = isNoteOn(new Uint8Array([176, 7, 100]));
    expect(result).toBe(false);
  });

  test('should return false for an unknown message type', () => {
    (getType as jest.Mock).mockReturnValue(999);

    const result = isNoteOn(new Uint8Array([144, 60, 100]));
    expect(result).toBe(false);
  });

  test('should return false when getVelocity returns an invalid value', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);
    (getVelocity as jest.Mock).mockReturnValue(-1);

    const result = isNoteOn(new Uint8Array([144, 60, 100]));
    expect(result).toBe(false);
  });
});
