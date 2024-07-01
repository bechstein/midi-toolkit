import { MidiMessage, MidiParser } from './midi-parser';
import { MidiParserOptions } from './types/midi-parser-options';
import { MidiNoteOnMessage } from './types/midi-note-on-message';
import { MidiMessageType } from './types/midi-message-type';

describe('MidiParser', () => {
  let midiParser: MidiParser;
  const consoleLogDefinition = console.log;

  beforeEach(() => {
    midiParser = new MidiParser();
  });

  afterEach(() => {
    console.log = consoleLogDefinition;
  });

  test('should create', () => {
    expect(midiParser).toBeTruthy();
  });

  test('should add a subscriber', () => {
    const handler = (message: MidiMessage) => message;
    midiParser.subscribe(handler);
    expect(midiParser['_handlers'].length).toBe(1);
  });

  test('should remove a subscriber', () => {
    const handler = (message: MidiMessage) => message;
    midiParser.subscribe(handler);
    expect(midiParser['_handlers'].length).toBe(1);
    midiParser.unsubscribe(handler);
    expect(midiParser['_handlers'].length).toBe(0);
  });

  test('should turn on logger', () => {
    const config = {
      logMessages: true,
    } as Partial<MidiParserOptions>;
    midiParser.configure(config);
    expect(midiParser['_options'].logMessages).toBe(config.logMessages);
    expect(midiParser['_options'].enableHighResVelocity).toBe(false);
  });

  test('should enable high resolution velocity messages', () => {
    const config = {
      enableHighResVelocity: true,
    } as Partial<MidiParserOptions>;
    midiParser.configure(config);
    expect(midiParser['_options'].enableHighResVelocity).toBe(config.enableHighResVelocity);
    expect(midiParser['_options'].logMessages).toBe(false);
  });

  test('should log midi message when logging is enabled', () => {
    console.log = jest.fn();
    midiParser['_dispatchMidiMessage'] = jest.fn();
    const msg = {} as MIDIMessageEvent;
    midiParser.configure({ logMessages: true });
    midiParser.instant(msg);
    expect(console.log).toHaveBeenNthCalledWith(1, msg);
  });

  test.each([
    [0x90, 1],
    [0x91, 2],
    [0x92, 3],
    [0x93, 4],
    [0x94, 5],
    [0x95, 6],
    [0x96, 7],
    [0x97, 8],
    [0x98, 9],
    [0x99, 10],
    [0x9a, 11],
    [0x9b, 12],
    [0x9c, 13],
    [0x9d, 14],
    [0x9e, 15],
    [0x9f, 16],
  ])('should parse event type %i and return channel %s', (n, expected) => {
    const msg = {
      data: Uint8Array.from([n, 21, 1]),
    } as MIDIMessageEvent;
    expect(midiParser.instant(msg)?.channel).toBe(expected);
  });

  test('should parse midi note on message and instant return the message', () => {
    const msg = {
      data: Uint8Array.from([0x90, 60, 100]),
    } as MIDIMessageEvent;
    const parsed = midiParser.instant(msg) as MidiNoteOnMessage;
    expect(parsed).toStrictEqual({
      type: MidiMessageType.NOTE_ON,
      channel: 1,
      key: 60,
      velocity: 100,
    } as MidiNoteOnMessage);
  });

  test('should return undefined if midi message does not have data', () => {
    const msg = {} as MIDIMessageEvent;
    expect(midiParser.instant(msg)).toBeUndefined();
  });

  test('should normalize note off message and parse the data', () => {
    const msg = {
      data: Uint8Array.from([0x90, 60, 0]),
    } as MIDIMessageEvent;
    const parsed = midiParser.instant(msg) as MidiNoteOnMessage;
    expect(parsed).toStrictEqual({
      type: MidiMessageType.NOTE_ON,
      channel: 1,
      key: 60,
      velocity: 0,
    } as MidiNoteOnMessage);
  });

  test('should parse note off event with type 128 and channel 2', () => {
    const msg = {
      data: Uint8Array.from([0x81, 60, 0]),
    } as MIDIMessageEvent;
    const parsed = midiParser.instant(msg) as MidiNoteOnMessage;
    expect(parsed).toStrictEqual({
      type: MidiMessageType.NOTE_ON,
      channel: 2,
      key: 60,
      velocity: 0,
    } as MidiNoteOnMessage);
  });

  test('should dispatch parsed midi message to all subscribers', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    midiParser.subscribe(handler1);
    midiParser.subscribe(handler2);
    midiParser['_dispatchMidiMessage'] = jest.fn().mockReturnValue({} as MidiNoteOnMessage);

    midiParser.parseMessage({} as MIDIMessageEvent);
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  test('should log the midi message and dispatch to all subscribers', () => {
    midiParser.configure({ logMessages: true });
    console.log = jest.fn();
    const handler1 = jest.fn();
    const msg = {} as MIDIMessageEvent;
    midiParser.subscribe(handler1);
    midiParser['_dispatchMidiMessage'] = jest.fn().mockReturnValue({} as MidiNoteOnMessage);

    midiParser.parseMessage(msg);
    expect(console.log).toHaveBeenNthCalledWith(1, msg);
  });

  test('should return undefined for unhandled midi message type', () => {
    const msg = {
      data: Uint8Array.from([0x1, 60, 0]),
    } as MIDIMessageEvent;
    const parsed = midiParser.instant(msg);
    expect(parsed).toBeUndefined();
  });
});
