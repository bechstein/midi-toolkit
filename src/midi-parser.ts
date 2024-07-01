import { MidiNoteOnMessage } from './types/midi-note-on-message';
import { MidiNoteOffMessage } from './types/midi-note-off-message';
import { MidiMessageType } from './types/midi-message-type';
import { MidiParserOptions } from './types/midi-parser-options';
import { MidiControlChangeMessage } from './types/midi-control-change-message';
import { ControlChangeMessageType } from './types/control-change-message-type';

export type MidiMessage = MidiNoteOnMessage | MidiNoteOffMessage | MidiControlChangeMessage;
export type MidiMessageHandler = (message: MidiMessage) => void;

export class MidiParser {
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
    const message = this._dispatchMidiMessage(midiMessageEvent);
    if (message) this._handlers.forEach((handler) => handler(message));
  }

  public instant(midiMessageEvent: MIDIMessageEvent): MidiMessage | undefined {
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

  private _dispatchMidiMessage(midiMessageEvent: MIDIMessageEvent): MidiMessage | undefined {
    let data: Uint8Array;

    if (midiMessageEvent.data) {
      data = midiMessageEvent.data;
    } else {
      if (this.options.logMessages) console.warn('Undefined MIDI event packet');
      return undefined;
    }

    const statusByte = data[0];
    const messageType = (statusByte >> 4) & 0x0f;
    const channel = statusByte & 0x0f;
    const controllerNumber = data[1];
    const controllerValue = data[2];

    switch (messageType) {
      case 0x8:
      case 0x9:
        return this._handleNoteOnMessage(channel, messageType, controllerNumber, controllerValue);
      case 0xb:
        return this._handleControlChangeMessage(controllerNumber, channel, controllerValue);
      default:
        if (this.options.logMessages) console.warn('Unhandled MIDI message type', messageType);
        return undefined;
    }
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
          channel: channel,
          controller: ControlChangeMessageType.SOSTENUTO_PEDAL,
          value: controllerValue,
        };
      case 0x43: // soft Pedal
        return {
          type: MidiMessageType.CONTROL_CHANGE,
          channel: channel,
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
}
