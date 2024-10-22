export function getStatusByte(data: Uint8Array): number {
  if (data.length < 1) {
    return -1;
  } else return data[0];
}
