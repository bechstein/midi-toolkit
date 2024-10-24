import { getControllerValue } from './get-controller-value';
import { getType } from './get-type';
import { MessageType } from './types/message-type';

jest.mock('./get-type', () => ({
  getType: jest.fn(),
}));

describe('getControllerValue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return the controller value for a Control Change message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);

    const result = getControllerValue(new Uint8Array([176, 7, 100]));
    expect(result).toBe(100);
  });

  test('should throw error for a Note On message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);
    expect(() => getControllerValue(new Uint8Array([144, 60, 100]))).toThrow();
  });

  test('should throw error for a Note Off message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_OFF);
    expect(() => getControllerValue(new Uint8Array([128, 60, 0]))).toThrow();
  });

  test('should throw error for an incomplete Control Change message (missing third byte)', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);
    expect(() => getControllerValue(new Uint8Array([176, 7]))).toThrow();
  });

  test('should return the correct controller value when the third byte is 0', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);

    const result = getControllerValue(new Uint8Array([176, 7, 0]));
    expect(result).toBe(0);
  });

  test('should throw error for an unknown message type', () => {
    (getType as jest.Mock).mockReturnValue(999);
    expect(() => getControllerValue(new Uint8Array([176, 7, 100]))).toThrow();
  });

  test('should throw error for invalid or empty data', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);
    expect(() => getControllerValue(new Uint8Array([]))).toThrow();
  });
});
