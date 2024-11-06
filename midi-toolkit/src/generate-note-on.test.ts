import { generateNoteOn } from './generate-note-on';
import { generateNote } from './utils/generate-note';
import { MessageType } from './types/message-type';

jest.mock('./utils/generate-note', () => ({
  generateNote: jest.fn(),
}));

describe('generateNoteOn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call generateNote with correct arguments for Note On', () => {
    generateNoteOn(1, 60, 100);
    expect(generateNote).toHaveBeenCalledWith(MessageType.NOTE_ON, 1, 60, 100);
  });

  test('should call generateNote with correct arguments for minimum values', () => {
    generateNoteOn(1, 0, 0);
    expect(generateNote).toHaveBeenCalledWith(MessageType.NOTE_ON, 1, 0, 0);
  });

  test('should call generateNote with correct arguments for maximum values', () => {
    generateNoteOn(16, 127, 127);
    expect(generateNote).toHaveBeenCalledWith(MessageType.NOTE_ON, 16, 127, 127);
  });
});
