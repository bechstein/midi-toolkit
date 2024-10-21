import { getType } from './get-type';
import { MessageType } from './types/message-type';
import { getControllerNumber } from './get-controller-number';
import { ControlChangeMessageType } from './types/control-change-message-type';

export function isHighResVelocity(data: Uint8Array): boolean {
  const type = getType(data);
  if (type === MessageType.CONTROL_CHANGE) {
    const controllerNumber = getControllerNumber(data);
    return controllerNumber === ControlChangeMessageType.HIGH_RESOLUTION_VELOCITY;
  } else return false;
}
