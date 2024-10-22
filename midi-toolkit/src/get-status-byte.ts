export function getStatusByte(data: Uint8Array): number {
  if (data.length < 1) {
    throw new Error('Invalid MIDI data: data length must be at least 1');
  }
  return data[0];
}
