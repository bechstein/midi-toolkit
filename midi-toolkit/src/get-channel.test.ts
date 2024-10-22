import { getStatusByte } from './get-status-byte';
import { getChannel } from './get-channel';

jest.mock('./get-status-byte', () => ({
  getStatusByte: jest.fn(),
}));

describe('getChannel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return channel 1 for status byte 0x90 (Note On, channel 1)', () => {
    (getStatusByte as jest.Mock).mockReturnValue(0x90);
    const result = getChannel(new Uint8Array([0x90, 0x40, 0x7f]));
    expect(result).toBe(1);
  });

  test('should return channel 16 for status byte 0x9F (Note On, channel 16)', () => {
    (getStatusByte as jest.Mock).mockReturnValue(0x9f);
    const result = getChannel(new Uint8Array([0x9f, 0x40, 0x7f]));
    expect(result).toBe(16);
  });

  test('should handle minimum possible channel (Note Off, channel 1)', () => {
    (getStatusByte as jest.Mock).mockReturnValue(0x80);
    const result = getChannel(new Uint8Array([0x80, 0x40, 0x7f]));
    expect(result).toBe(1);
  });

  test('should handle maximum possible channel (Note Off, channel 16)', () => {
    (getStatusByte as jest.Mock).mockReturnValue(0x8f);
    const result = getChannel(new Uint8Array([0x8f, 0x40, 0x7f]));
    expect(result).toBe(16);
  });

  test('should return -1 when data is empty', () => {
    (getStatusByte as jest.Mock).mockReturnValue(undefined);
    expect(getChannel(new Uint8Array([]))).toBe(-1);
  });

  test('should return channel for valid running status', () => {
    (getStatusByte as jest.Mock).mockReturnValue(0xb2);
    const result = getChannel(new Uint8Array([0xb2, 0x40, 0x7f]));
    expect(result).toBe(3);
  });

  test('should correctly parse channel when high-order bits are set', () => {
    (getStatusByte as jest.Mock).mockReturnValue(0xe7);
    const result = getChannel(new Uint8Array([0xe7, 0x40, 0x7f]));
    expect(result).toBe(8);
  });

  test('should return -1 when status byte is 0xf0', () => {
    (getStatusByte as jest.Mock).mockReturnValue(0xf0);
    expect(getChannel(new Uint8Array([]))).toBe(-1);
  });

  test('should return -1 when status byte is 0xff', () => {
    (getStatusByte as jest.Mock).mockReturnValue(0xff);
    expect(getChannel(new Uint8Array([]))).toBe(-1);
  });
});
