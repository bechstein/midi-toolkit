import { getStatusByte } from './get-status-byte';

describe('getStatusByte', () => {
  test('should return the first byte for valid data', () => {
    const result = getStatusByte(new Uint8Array([144, 60, 100]));
    expect(result).toBe(144);
  });

  test('should return the first byte even if there is only one byte', () => {
    const result = getStatusByte(new Uint8Array([128]));
    expect(result).toBe(128);
  });

  test('should throw an error for empty data', () => {
    expect(() => getStatusByte(new Uint8Array([]))).toThrow();
  });

  test('should return the first byte when data has multiple bytes', () => {
    const result = getStatusByte(new Uint8Array([240, 64, 127, 64, 127, 128]));
    expect(result).toBe(240);
  });
});
