export type ErrorName = 'UnsupportedMIDIMessageError' | 'InvalidMIDIDataError';

export class InvalidMIDIMessageError<T> extends Error {
  constructor(name: ErrorName, message: string, data: T) {
    super(`${message}: ${data}`);
    this.name = name;
  }
}