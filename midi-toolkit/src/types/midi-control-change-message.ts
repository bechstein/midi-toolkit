import { ControlChangeMessageType } from './control-change-message-type';

export interface MidiControlChangeMessage {
  type: 176;
  channel: number;
  controller: ControlChangeMessageType;
  value: number;
}
