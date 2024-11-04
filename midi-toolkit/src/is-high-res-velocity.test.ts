import { isHighResVelocity } from './is-high-res-velocity';
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

describe('isHighResVelocity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return true for Control Change with High-Resolution Velocity controller', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);
    (getControllerNumber as jest.Mock).mockReturnValue(ControlChangeMessageType.HIGH_RESOLUTION_VELOCITY);

    const result = isHighResVelocity(new Uint8Array([176, 7, 100]));
    expect(result).toBe(true);
  });

  test('should return false for Control Change with a different controller', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);
    (getControllerNumber as jest.Mock).mockReturnValue(ControlChangeMessageType.SUSTAIN_PEDAL);

    const result = isHighResVelocity(new Uint8Array([176, 64, 100]));
    expect(result).toBe(false);
  });

  test('should return false for a Note On message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_ON);

    const result = isHighResVelocity(new Uint8Array([144, 60, 100]));
    expect(result).toBe(false);
  });

  test('should return false for a Note Off message', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.NOTE_OFF);

    const result = isHighResVelocity(new Uint8Array([128, 60, 0]));
    expect(result).toBe(false);
  });

  test('should return false for an unknown message type', () => {
    (getType as jest.Mock).mockReturnValue(999);

    const result = isHighResVelocity(new Uint8Array([176, 7, 100]));
    expect(result).toBe(false);
  });

  test('should return false when getControllerNumber returns an invalid controller number', () => {
    (getType as jest.Mock).mockReturnValue(MessageType.CONTROL_CHANGE);
    (getControllerNumber as jest.Mock).mockReturnValue(999);

    const result = isHighResVelocity(new Uint8Array([176, 7, 100]));
    expect(result).toBe(false);
  });
});
