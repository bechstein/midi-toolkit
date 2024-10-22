import { getType } from './get-type';
import { MessageType } from './types/message-type';

export function getControllerValue(data: Uint8Array): number {
  const type = getType(data);
  if (type === MessageType.CONTROL_CHANGE && data.length > 2) {
    return data[2];
  } else return -1;
}
