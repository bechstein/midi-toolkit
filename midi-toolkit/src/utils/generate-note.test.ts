import { generateNote } from './generate-note';
import { generateStatusByte } from '../generate-status-byte';
import { MessageType } from '../types/message-type';
import { InvalidMIDIMessageError } from '../error/invalid-midi-message-error';

jest.mock('../generate-status-byte', () => ({
  generateStatusByte: jest.fn(),
}));

describe('generateNote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should generate a valid Note On message', () => {
    (generateStatusByte as jest.Mock).mockReturnValue(0x90);

    const result = generateNote(MessageType.NOTE_ON, 1, 60, 100);
    expect(result).toEqual(new Uint8Array([0x90, 60, 100]));
    expect(generateStatusByte).toHaveBeenCalledWith(MessageType.NOTE_ON, 1);
  });

  test('should throw an error if the note is out of range (negative)', () => {
    expect(() => generateNote(MessageType.NOTE_ON, 1, -1, 100)).toThrow(InvalidMIDIMessageError);
  });

  test('should throw an error if the note is out of range (greater than 127)', () => {
    expect(() => generateNote(MessageType.NOTE_ON, 1, 128, 100)).toThrow(InvalidMIDIMessageError);
  });

  test('should throw an error if the velocity is out of range (negative)', () => {
    expect(() => generateNote(MessageType.NOTE_ON, 1, 60, -1)).toThrow(InvalidMIDIMessageError);
  });

  test('should throw an error if the velocity is out of range (greater than 127)', () => {
    expect(() => generateNote(MessageType.NOTE_ON, 1, 60, 128)).toThrow(InvalidMIDIMessageError);
  });

  test('should generate a Note On message with note 0 and velocity 0', () => {
    (generateStatusByte as jest.Mock).mockReturnValue(0x90);

    const result = generateNote(MessageType.NOTE_ON, 1, 0, 0);
    expect(result).toEqual(new Uint8Array([0x90, 0, 0]));
    expect(generateStatusByte).toHaveBeenCalledWith(MessageType.NOTE_ON, 1);
  });

  test('should generate a Note On message with note 127 and velocity 127', () => {
    (generateStatusByte as jest.Mock).mockReturnValue(0x90);

    const result = generateNote(MessageType.NOTE_ON, 1, 127, 127);
    expect(result).toEqual(new Uint8Array([0x90, 127, 127]));
    expect(generateStatusByte).toHaveBeenCalledWith(MessageType.NOTE_ON, 1);
  });
});
