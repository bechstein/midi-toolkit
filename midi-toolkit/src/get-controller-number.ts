import { getType } from './get-type';
import { MessageType } from './types/message-type';

export function getControllerNumber(data: Uint8Array): number {
  const type = getType(data);
  if (type === MessageType.CONTROL_CHANGE && data.length > 1) {
    return data[1];
  } else return -1;
}
