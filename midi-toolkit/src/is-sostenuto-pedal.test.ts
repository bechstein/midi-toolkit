import { isSostenutoPedal } from './is-sostenuto-pedal';
import { getType } from './get-type';
import { getControllerNumber } from './get-controller-number';
import { MessageType } from './types/message-type';
import { ControlChangeMessageType } from './types/control-change-message-type';

jest.mock('./get-type', () => ({
  getType: jest.fn(),
}));

jest.mock('./get-controller-number', () => ({
  getControllerNumber: jest.fn(),
}));

describe('isSostenutoPedal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return true for Control Change with sostenuto pedal controller', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);
    (getControllerNumber as jest.Mock).mockReturnValue(ControlChangeMessageType.SOSTENUTO_PEDAL);

    const result = isSostenutoPedal(new Uint8Array([176, 66, 127]));
    expect(result).toBe(true);
  });

  test('should return false for Control Change with a non-sostenuto controller', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);
    (getControllerNumber as jest.Mock).mockReturnValue(ControlChangeMessageType.SUSTAIN_PEDAL);

    const result = isSostenutoPedal(new Uint8Array([176, 64, 127]));
    expect(result).toBe(false);
  });

  test('should return false for non-Control Change message type (Note On)', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);

    const result = isSostenutoPedal(new Uint8Array([144, 60, 100]));
    expect(result).toBe(false);
  });

  test('should return false for non-Control Change message type (Note Off)', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_OFF);

    const result = isSostenutoPedal(new Uint8Array([128, 60, 100]));
    expect(result).toBe(false);
  });

  test('should return false when getControllerNumber returns an invalid controller number', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);
    (getControllerNumber as jest.Mock).mockReturnValue(999);

    const result = isSostenutoPedal(new Uint8Array([176, 99, 127]));
    expect(result).toBe(false);
  });

  test('should return false when getType returns an unknown message type', () => {
    (getType as jest.Mock).mockReturnValue(999);

    const result = isSostenutoPedal(new Uint8Array([0x00]));
    expect(result).toBe(false);
  });
});
