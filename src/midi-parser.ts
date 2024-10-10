import { MidiNoteOnMessage } from './types/midi-note-on-message';
import { MidiNoteOffMessage } from './types/midi-note-off-message';
import { MidiMessageType } from './types/midi-message-type';
import { MidiParserOptions } from './types/midi-parser-options';
import { MidiControlChangeMessage } from './types/midi-control-change-message';
import { ControlChangeMessageType } from './types/control-change-message-type';

export type MidiMessage = MidiNoteOnMessage | MidiNoteOffMessage | MidiControlChangeMessage;
export type MidiMessageHandler = (message: MidiMessage) => void;

export class MidiParser {
  private static readonly MESSAGE_TYPES = [0x8, 0x9, 0xa, 0xb, 0xe, 0xc, 0xd];
  private _velocityPrefixes: number[] = new Array(16).fill(0);
  private _handlers: MidiMessageHandler[] = [];

  constructor(
    private _options: MidiParserOptions = {
      logMessages: false,
      enableHighResVelocity: false,
    }
  ) {}

  public subscribe(handler: MidiMessageHandler): void {
    this._handlers.push(handler);
  }

  public unsubscribe(handler: MidiMessageHandler): void {
    this._handlers = this._handlers.filter((h) => h !== handler);
  }

  public parseMessage(midiMessageEvent: MIDIMessageEvent): void {
    if (this.options.logMessages) console.log(midiMessageEvent);
    const messageArr = this._dispatchMidiMessage(midiMessageEvent);
    messageArr.forEach((message) => {
      this._handlers.forEach((handler) => {
        if (message) handler(message);
      });
    });
  }

  public instant(midiMessageEvent: MIDIMessageEvent): (MidiMessage | undefined)[] {
    if (this.options.logMessages) console.log(midiMessageEvent);
    return this._dispatchMidiMessage(midiMessageEvent);
  }

  public configure(options: Partial<MidiParserOptions>): void {
    this._options = {
      ...this.options,
      ...options,
    };
  }

  private get options(): MidiParserOptions {
    return this._options;
  }

  private _dispatchMidiMessage(midiMessageEvent: MIDIMessageEvent): (MidiMessage | undefined)[] {
    let data: Uint8Array;

    if (midiMessageEvent.data) {
      data = midiMessageEvent.data;
    } else {
      if (this.options.logMessages) console.warn('Undefined MIDI event packet');
      return [];
    }

    const splitChunks = this._splitPayload(data);

    return splitChunks.map((chunk) => {
      const statusByte = chunk[0];
      const messageType = MidiParser.getMessageType(statusByte);
      const channel = statusByte & 0x0f;
      const controllerNumber = chunk[1];
      const controllerValue = chunk[2];

      switch (messageType) {
        case 0x8:
        case 0x9:
          return this._handleNoteOnMessage(channel, messageType, controllerNumber, controllerValue);
        case 0xb:
          return this._handleControlChangeMessage(controllerNumber, channel, controllerValue);
        case 0xa:
        case 0xe:
        case 0xc:
        case 0xd:
        default:
          if (this.options.logMessages) console.warn('Unhandled MIDI message type', messageType);
          return undefined;
      }
    });
  }

  private _handleNoteOnMessage(
    channel: number,
    messageType: number,
    controllerNumber: number,
    controllerValue: number
  ): MidiNoteOnMessage {
    const lsbVelocity = this._velocityPrefixes[channel];
    if (controllerValue === 0 || messageType === 0x8) {
      //  an event is note-off if its of type 0x9 with velocity 0 or its of type 0x8
      return { type: MidiMessageType.NOTE_ON, channel: channel + 1, key: controllerNumber, velocity: 0 };
    } else if (this.options.enableHighResVelocity && lsbVelocity) {
      // provide highRes info if highRes is enabled and there exists LSB velocity for this channel
      const velocity = (controllerValue << 7) | lsbVelocity;
      this._velocityPrefixes[channel] = 0;
      return { type: MidiMessageType.NOTE_ON, channel: channel + 1, key: controllerNumber, velocity };
    } else {
      // normal note-on event
      return { type: MidiMessageType.NOTE_ON, channel: channel + 1, key: controllerNumber, velocity: controllerValue };
    }
  }

  private _handleControlChangeMessage(
    controllerNumber: number,
    channel: number,
    controllerValue: number
  ): MidiControlChangeMessage | undefined {
    switch (controllerNumber) {
      case 0x40: // sustain Pedal
        return {
          type: MidiMessageType.CONTROL_CHANGE,
          channel: channel + 1,
          controller: ControlChangeMessageType.SUSTAIN_PEDAL,
          value: controllerValue,
        };
      case 0x42: // sostenuto Pedal
        return {
          type: MidiMessageType.CONTROL_CHANGE,
          channel: channel + 1,
          controller: ControlChangeMessageType.SOSTENUTO_PEDAL,
          value: controllerValue,
        };
      case 0x43: // soft Pedal
        return {
          type: MidiMessageType.CONTROL_CHANGE,
          channel: channel + 1,
          controller: ControlChangeMessageType.SOFT_PEDAL,
          value: controllerValue,
        };
      case 0x58: // high resolution velocity
        this._velocityPrefixes[channel] = controllerValue;
        return undefined;
      default:
        return undefined;
    }
  }

  private _splitPayload(data: Uint8Array): Uint8Array[] {
    const splitPayload: Uint8Array[] = [];
    let currentMessage: number[] = [];

    for (let i = 0; i < data.length; i++) {
      const byte = data[i];
      if (MidiParser.isMessageTypeByte(byte) && currentMessage.length > 0) {
        splitPayload.push(Uint8Array.from(currentMessage));
        currentMessage = [];
      }

      currentMessage.push(byte);

      if (i === data.length - 1) {
        splitPayload.push(Uint8Array.from(currentMessage));
        currentMessage = [];
      }
    }

    return splitPayload;
  }

  private static getMessageType(statusByte: number): number {
    return (statusByte >> 4) & 0x0f;
  }

  private static isMessageTypeByte(byte: number): boolean {
    return MidiParser.MESSAGE_TYPES.some((statusByte) => statusByte === MidiParser.getMessageType(byte));
  }
}
