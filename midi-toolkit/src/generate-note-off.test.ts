import { generateNoteOff } from './generate-note-off';
import { generateNote } from './utils/generate-note';
import { MessageType } from './types/message-type';

jest.mock('./utils/generate-note', () => ({
  generateNote: jest.fn(),
}));

describe('generateNoteOff', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call generateNote with correct arguments for Note Off', () => {
    generateNoteOff(1, 60, 0);
    expect(generateNote).toHaveBeenCalledWith(MessageType.NOTE_OFF, 1, 60, 0);
  });

  test('should call generateNote with correct arguments for minimum values', () => {
    generateNoteOff(1, 0, 0);
    expect(generateNote).toHaveBeenCalledWith(MessageType.NOTE_OFF, 1, 0, 0);
  });

  test('should call generateNote with correct arguments for maximum values', () => {
    generateNoteOff(16, 127, 127);
    expect(generateNote).toHaveBeenCalledWith(MessageType.NOTE_OFF, 16, 127, 127);
  });
});
