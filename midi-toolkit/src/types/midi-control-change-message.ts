import { MidiMessageType } from './midi-message-type';
import { ControlChangeMessageType } from './control-change-message-type';

export interface MidiControlChangeMessage {
  type: MidiMessageType.CONTROL_CHANGE;
  channel: number;
  controller: ControlChangeMessageType;
  value: number;
}
