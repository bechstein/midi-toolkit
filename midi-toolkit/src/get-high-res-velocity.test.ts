import { getHighResVelocity } from './get-high-res-velocity';
import { getType } from './get-type';
import { getVelocity } from './get-velocity';
import { MessageType } from './types/message-type';

jest.mock('./get-type', () => ({
  getType: jest.fn(),
}));

jest.mock('./get-velocity', () => ({
  getVelocity: jest.fn(),
}));

describe('getHighResVelocity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return the high-resolution velocity for a valid Note On message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);
    (getVelocity as jest.Mock).mockReturnValue(64);

    const result = getHighResVelocity(new Uint8Array([144, 60, 64]), 10);
    expect(result).toBe((64 << 7) | 10);
  });

  test('should return the high-resolution velocity for a valid Note Off message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_OFF);
    (getVelocity as jest.Mock).mockReturnValue(32);

    const result = getHighResVelocity(new Uint8Array([128, 60, 32]), 5);
    expect(result).toBe((32 << 7) | 5);
  });

  test('should throw error for a Control Change message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);
    expect(() => getHighResVelocity(new Uint8Array([176, 7, 100]), 10)).toThrow();
  });

  test('should return correct velocity when lsb is 0', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);
    (getVelocity as jest.Mock).mockReturnValue(127);

    const result = getHighResVelocity(new Uint8Array([144, 60, 127]), 0);
    expect(result).toBe((127 << 7) | 0);
  });

  test('should return correct velocity when lsb is at maximum (127)', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_OFF);
    (getVelocity as jest.Mock).mockReturnValue(100);

    const result = getHighResVelocity(new Uint8Array([128, 60, 100]), 127);
    expect(result).toBe((100 << 7) | 127);
  });

  test('should throw error when getVelocity returns an invalid value', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);
    (getVelocity as jest.Mock).mockImplementation((data) => {
      throw new Error(data);
    });
    expect(() => getHighResVelocity(new Uint8Array([144, 60, 100]), 10)).toThrow();
  });

  test('should throw error for an unknown message type', () => {
    (getType as jest.Mock).mockReturnValue(999);
    expect(() => getHighResVelocity(new Uint8Array([144, 60, 100]), 10)).toThrow();
  });
});
