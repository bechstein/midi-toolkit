import { MidiParser } from './midi-parser';

describe('MidiParser', () => {
  let midiParser: MidiParser;

  beforeEach(() => {
    midiParser = new MidiParser();
  });

  test('should be defined', () => {
    expect(midiParser).toBeTruthy();
  });
});
