import { isControlChange } from './is-control-change';
import { getType } from './get-type';
import { MessageType } from './types/message-type';

jest.mock('./get-type', () => ({
  getType: jest.fn(),
}));

describe('isControlChange', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return true for a Control Change message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);

    const result = isControlChange(new Uint8Array([176, 7, 100]));
    expect(result).toBe(true);
  });

  test('should return false for a Note On message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);

    const result = isControlChange(new Uint8Array([144, 60, 100]));
    expect(result).toBe(false);
  });

  test('should return false for a Pitch Bend message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.PITCH_BEND);

    const result = isControlChange(new Uint8Array([224, 0, 64]));
    expect(result).toBe(false);
  });

  test('should return false for a Program Change message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.PROGRAM_CHANGE);

    const result = isControlChange(new Uint8Array([192, 10]));
    expect(result).toBe(false);
  });

  test('should return false for a Note Off message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_OFF);

    const result = isControlChange(new Uint8Array([128, 60, 100]));
    expect(result).toBe(false);
  });

  test('should return false when getType returns an unknown message type', () => {
    (getType as jest.Mock).mockReturnValue(999);

    const result = isControlChange(new Uint8Array([0x00]));
    expect(result).toBe(false);
  });
});
