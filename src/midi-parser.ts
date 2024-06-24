import { MidiNoteOnMessage } from './types/midi-note-on-message';
import { MidiNoteOffMessage } from './types/midi-note-off-message';
import { MidiMessageType } from './types/midi-message-type';

export type MidiMessage = MidiNoteOnMessage | MidiNoteOffMessage;
export type MidiMessageHandler = (message: MidiMessage) => void;

export class MidiParser {
  private velocityPrefixes: number[] = new Array(16).fill(0);
  private handlers: MidiMessageHandler[] = [];

  constructor(public options: {
    logMessages: boolean;
    enableHighResVelocity: boolean;
  } = {
    logMessages: false,
    enableHighResVelocity: false,
  }) {}

  public subscribe(handler: MidiMessageHandler): void {
    this.handlers.push(handler);
  }

  public unsubscribe(handler: MidiMessageHandler): void {
    this.handlers = this.handlers.filter(h => h !== handler);
  }

  public parseMessage(midiMessageEvent: MIDIMessageEvent): void {
    if (this.options.logMessages) console.log(midiMessageEvent);
    const message = this._dispatchMidiMessage(midiMessageEvent);
    if (message) this.handlers.forEach(handler => handler(message));
  }

  private _dispatchMidiMessage(midiMessageEvent: MIDIMessageEvent): MidiMessage | undefined {
    const data = midiMessageEvent.data;
    const statusByte = data[0];
    const messageType = (statusByte >> 4) & 0x0F;
    const channel = statusByte & 0x0F;
    const key = data[1];
    const msbVelocity = data[2];

    switch (messageType) {
      case 0x8:
      case 0x9:
        const lsbVelocity = this.velocityPrefixes[channel];

        if (msbVelocity === 0 ||messageType === 0x8) {
          //  an event is note-off if its of type 0x9 with velocity 0 or its of type 0x8
          return { type: MidiMessageType.NOTE_ON, channel: channel + 1, key, velocity: 0 };
        } else if (this.options.enableHighResVelocity && lsbVelocity) {
          // provide highRes info if highRes is enabled and there exists LSB velocity for this channel
          const velocity = (msbVelocity << 7) | lsbVelocity;
          this.velocityPrefixes[channel] = 0;
          return { type: MidiMessageType.NOTE_ON, channel: channel + 1, key, velocity };
        } else {
          // normal note-on event
          return { type: MidiMessageType.NOTE_ON, channel: channel + 1, key, velocity: msbVelocity };
        }
      case 0xB:
        if (key === 88) {
          this.velocityPrefixes[channel] = msbVelocity;
        }
        return undefined;
      default:
        if (this.options.logMessages) console.warn('Unhandled MIDI message type', messageType);
        return undefined;
    }
  }
}