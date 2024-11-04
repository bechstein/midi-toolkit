import { getType } from './get-type';
import { getStatusByte } from './get-status-byte';

jest.mock('./get-status-byte', () => ({
  getStatusByte: jest.fn(),
}));

describe('getType', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should extract type from a Note On message (0x90)', () => {
    (getStatusByte as jest.Mock).mockReturnValue(0x90);
    const result = getType(new Uint8Array([0x90, 0x40, 0x7f]));
    expect(result).toBe(0x9);
  });

  test('should extract type from a Control Change message (0xB0)', () => {
    (getStatusByte as jest.Mock).mockReturnValue(0xb0);
    const result = getType(new Uint8Array([0xb0, 0x07, 0x64]));
    expect(result).toBe(0xb);
  });

  test('should extract type from a Note Off message (0x80)', () => {
    (getStatusByte as jest.Mock).mockReturnValue(0x80);
    const result = getType(new Uint8Array([0x80, 0x40, 0x00]));
    expect(result).toBe(0x8);
  });

  test('should return correct type for Pitch Bend message (0xE0)', () => {
    (getStatusByte as jest.Mock).mockReturnValue(0xe0);
    const result = getType(new Uint8Array([0xe0, 0x40, 0x40]));
    expect(result).toBe(0xe);
  });
});
