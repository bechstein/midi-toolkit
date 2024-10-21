import { MidiNoteOnMessage } from './types/midi-note-on-message';
import { MidiNoteOffMessage } from './types/midi-note-off-message';
import { MidiParserOptions } from './types/midi-parser-options';
import { MidiControlChangeMessage } from './types/midi-control-change-message';
import { ControlChangeMessageType } from './types/control-change-message-type';
import { MessageType } from './types/message-type';
import { getType } from './get-type';
import { getChannel } from './get-channel';
import { getControllerNumber } from './get-controller-number';
import { getControllerValue } from './get-controller-value';
import { splitDataPayload } from './split-data-payload';
import { isNoteOff } from './is-note-off';
import { getHighResVelocity } from './get-high-res-velocity';

export type MidiMessage = MidiNoteOnMessage | MidiNoteOffMessage | MidiControlChangeMessage;
export type MidiMessageHandler = (message: MidiMessage) => void;

export class MidiParser {
  private _velocityPrefixes: number[] = new Array(16).fill(0);
  private _handlers: MidiMessageHandler[] = [];

  constructor(
    private _options: MidiParserOptions = {
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
    const messageArr = this._dispatchMidiMessage(midiMessageEvent);
    messageArr.forEach((message) => {
      this._handlers.forEach((handler) => {
        if (message) handler(message);
      });
    });
  }

  public instant(midiMessageEvent: MIDIMessageEvent): (MidiMessage | undefined)[] {
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
    } else return [];

    const splitChunks = splitDataPayload(data);

    return splitChunks.map((chunk) => {
      const messageType = getType(chunk);
      const channel = getChannel(chunk);
      const controllerNumber = getControllerNumber(chunk);
      const controllerValue = getControllerValue(chunk);

      switch (messageType) {
        case MessageType.NOTE_OFF:
        case MessageType.NOTE_ON:
          return this._handleNoteOnMessage(channel, chunk, controllerNumber, controllerValue);
        case MessageType.CONTROL_CHANGE:
          return this._handleControlChangeMessage(controllerNumber, channel, controllerValue);
        case MessageType.POLYPHONIC_AFTERTOUCH:
        case MessageType.PITCH_BEND:
        case MessageType.PROGRAM_CHANGE:
        case MessageType.CHANNEL_AFTERTOUCH:
        default:
          return undefined;
      }
    });
  }

  private _handleNoteOnMessage(
    channel: number,
    data: Uint8Array,
    controllerNumber: number,
    controllerValue: number
  ): MidiNoteOnMessage {
    const lsbVelocity = this._velocityPrefixes[channel];
    if (isNoteOff(data)) {
      //  an event is note-off if its of type 0x9 with velocity 0 or its of type 0x8
      return { type: 144, channel: channel, key: controllerNumber, velocity: 0 };
    } else if (this.options.enableHighResVelocity && lsbVelocity) {
      // provide highRes info if highRes is enabled and there exists LSB velocity for this channel
      const velocity = getHighResVelocity(data, lsbVelocity);
      return { type: 144, channel: channel, key: controllerNumber, velocity };
    } else {
      // normal note-on event
      return { type: 144, channel: channel, key: controllerNumber, velocity: controllerValue };
    }
  }

  private _handleControlChangeMessage(
    controllerNumber: number,
    channel: number,
    controllerValue: number
  ): MidiControlChangeMessage | undefined {
    switch (controllerNumber) {
      case ControlChangeMessageType.SUSTAIN_PEDAL:
        return {
          type: 176,
          channel: channel,
          controller: ControlChangeMessageType.SUSTAIN_PEDAL,
          value: controllerValue,
        };
      case ControlChangeMessageType.SOSTENUTO_PEDAL:
        return {
          type: 176,
          channel: channel,
          controller: ControlChangeMessageType.SOSTENUTO_PEDAL,
          value: controllerValue,
        };
      case ControlChangeMessageType.SOFT_PEDAL:
        return {
          type: 176,
          channel: channel,
          controller: ControlChangeMessageType.SOFT_PEDAL,
          value: controllerValue,
        };
      case ControlChangeMessageType.HIGH_RESOLUTION_VELOCITY:
        this._velocityPrefixes[channel - 1] = controllerValue;
        return undefined;
      default:
        return undefined;
    }
  }
}
