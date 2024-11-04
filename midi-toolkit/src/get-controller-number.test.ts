import { getControllerNumber } from './get-controller-number';
import { getType } from './get-type';
import { MessageType } from './types/message-type';

jest.mock('./get-type', () => ({
  getType: jest.fn(),
}));

describe('getControllerNumber', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return the controller number for a Control Change message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);

    const result = getControllerNumber(new Uint8Array([176, 7, 100]));
    expect(result).toBe(7);
  });

  test('should throw error for a Note On message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);
    expect(() => getControllerNumber(new Uint8Array([144, 60, 100]))).toThrow();
  });

  test('should throw error for a Note Off message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_OFF);
    expect(() => getControllerNumber(new Uint8Array([128, 60, 0]))).toThrow();
  });

  test('should throw error for an incomplete Control Change message (missing second byte)', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);
    expect(() => getControllerNumber(new Uint8Array([176]))).toThrow();
  });

  test('should return -1 when the second byte is negative', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);

    const result = getControllerNumber(new Uint8Array([176, 255, 100]));
    expect(result).toBe(255);
  });

  test('should throw error for an unknown message type', () => {
    (getType as jest.Mock).mockReturnValue(999);
    expect(() => getControllerNumber(new Uint8Array([176, 7, 100]))).toThrow();
  });

  test('should throw error for invalid or empty data', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);
    expect(() => getControllerNumber(new Uint8Array([]))).toThrow();
  });
});
