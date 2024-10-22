import { splitDataPayload } from './split-data-payload';
import { MessageType } from './types/message-type';
import { getType } from './get-type';

jest.mock('./get-type', () => ({
  getType: jest.fn(),
}));

describe('splitDataPayload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should split payload into two messages', () => {
    (getType as jest.Mock).mockImplementation((data) => {
      const byte = data[0];
      if (byte === 144) return MessageType.NOTE_ON;
      if (byte === 128) return MessageType.NOTE_OFF;
      return undefined;
    });

    const result = splitDataPayload(new Uint8Array([144, 60, 100, 128, 60, 0]));
    expect(result).toEqual([new Uint8Array([144, 60, 100]), new Uint8Array([128, 60, 0])]);
  });

  test('should return single message if there is only one', () => {
    (getType as jest.Mock).mockImplementation((data) => {
      const byte = data[0];
      if (byte === 144) {
        return MessageType.NOTE_ON;
      } else return -1;
    });

    const result = splitDataPayload(new Uint8Array([144, 60, 100]));
    expect(result).toEqual([new Uint8Array([144, 60, 100])]);
  });

  test('should return empty array for empty input data', () => {
    const result = splitDataPayload(new Uint8Array([]));
    expect(result).toEqual([]);
  });

  test('should handle payload with multiple Note On messages', () => {
    (getType as jest.Mock).mockImplementation((data) => {
      const byte = data[0];
      if (byte === 144) return MessageType.NOTE_ON;
      return undefined;
    });

    const result = splitDataPayload(new Uint8Array([144, 60, 100, 144, 62, 110]));
    expect(result).toEqual([new Uint8Array([144, 60, 100]), new Uint8Array([144, 62, 110])]);
  });

  test('should handle a payload with an incomplete message at the end', () => {
    (getType as jest.Mock).mockImplementation((data) => {
      const byte = data[0];
      if (byte === 144) return MessageType.NOTE_ON;
      return undefined;
    });

    const result = splitDataPayload(new Uint8Array([144, 60, 100, 144, 62]));
    expect(result).toEqual([new Uint8Array([144, 60, 100]), new Uint8Array([144, 62])]);
  });

  test('should handle payload with unknown message type', () => {
    (getType as jest.Mock).mockImplementation((data) => {
      const byte = data[0];
      if (byte === 144) return MessageType.NOTE_ON;
      if (byte === 255) return MessageType.SYSEX;
      return -1;
    });

    const result = splitDataPayload(new Uint8Array([144, 60, 100, 255, 0, 0]));
    expect(result).toEqual([new Uint8Array([144, 60, 100]), new Uint8Array([255, 0, 0])]);
  });
});
