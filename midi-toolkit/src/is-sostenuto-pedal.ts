import { getType } from './get-type';
import { MessageType } from './types/message-type';
import { getControllerNumber } from './get-controller-number';
import { ControlChangeMessageType } from './types/control-change-message-type';

export function isSostenutoPedal(data: Uint8Array): boolean {
  const type = getType(data);
  if (type === MessageType.CONTROL_CHANGE) {
    const controllerNumber = getControllerNumber(data);
    return controllerNumber === ControlChangeMessageType.SOSTENUTO_PEDAL;
  } else return false;
}
