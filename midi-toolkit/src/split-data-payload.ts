import { MessageType } from './types/message-type';
import { getType } from './get-type';

export function splitDataPayload(data: Uint8Array): Uint8Array[] {
  const splitPayload: Uint8Array[] = [];
  let currentMessage: number[] = [];
  const validStatusBytes = Object.values(MessageType).filter((value) => !isNaN(Number(value)));

  for (let i = 0; i < data.length; i++) {
    const byte = data[i];
    if (validStatusBytes.includes(getType(data.slice(i))) && currentMessage.length > 0) {
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
