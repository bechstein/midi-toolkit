
# MIDI ToolKit Library

This library provides a set of utilities for parsing and working with MIDI message data. It offers functions to extract important details from MIDI messages, such as the message type, channel, and various control changes (e.g., sustain pedal, soft pedal), and also includes support for high-resolution velocity parsing.

## Features

- **Message Type Detection**: Identify different types of MIDI messages, such as "Note On", "Note Off", "Control Change", "Pitch Bend", and more.
- **Channel and Status Byte Extraction**: Easily extract the channel number and status byte from the MIDI message.
- **Control Change Handling**: Includes specialized functions to handle MIDI control change messages, such as sustain pedal, soft pedal, and sostenuto pedal.
- **High-Resolution Velocity**: Support for high-resolution velocity, with methods for detecting and processing it.
- **Message Splitting**: Split a raw MIDI data payload into individual messages for easy processing.

## Installation

You can install the package via npm:

```bash
npm install @bechstein/midi-toolkit
```

## Usage

### Importing the Library

You can import the functions and types provided by the library as needed:

```typescript
import { 
  getStatusByte, 
  getType, 
  getChannel, 
  isNoteOn, 
  isNoteOff, 
  getControllerNumber, 
  getControllerValue, 
  isControlChange, 
  isSustainPedal, 
  splitDataPayload 
} from '@bechstein/midi-toolkit';
```

### Parsing MIDI Messages

The library provides a simple way to parse MIDI messages, extract information, and handle specific message types:

```typescript
const midiData = new Uint8Array([144, 60, 100]);  // Example MIDI "Note On" message

const statusByte = getStatusByte(midiData);       // 144
const messageType = getType(midiData);            // MessageType.NOTE_ON
const channel = getChannel(midiData);             // 1

if (isNoteOn(midiData)) {
  console.log('Note On message received');
}
```

### Splitting a MIDI Payload

You can use `splitDataPayload` to split a batch of MIDI messages into individual messages:

```typescript
const midiPayload = new Uint8Array([176, 64, 127, 144, 60, 100]);
const splitMessages = splitDataPayload(midiPayload);

console.log(splitMessages);  // [[176, 64, 127], [144, 60, 100]]
```

### Control Change Messages

The library can help detect and handle various control change messages, including the sustain pedal:

```typescript
const controlChangeMessage = new Uint8Array([176, 64, 127]);

if (isControlChange(controlChangeMessage)) {
  const controllerNumber = getControllerNumber(controlChangeMessage); // 64
  const controllerValue = getControllerValue(controlChangeMessage);   // 127

  if (isSustainPedal(controlChangeMessage)) {
    console.log('Sustain pedal activated');
  }
}
```

## Available Functions

- **getStatusByte(data: Uint8Array)**: Extract the status byte from a MIDI message.
- **getType(data: Uint8Array)**: Get the type of the MIDI message (Note On, Note Off, etc.).
- **getChannel(data: Uint8Array)**: Extract the MIDI channel from a message.
- **isNoteOn(data: Uint8Array)**: Check if the message is a "Note On" message.
- **isNoteOff(data: Uint8Array)**: Check if the message is a "Note Off" message.
- **getNoteNumber(data: Uint8Array)**: Get the note number from "Note On" and "Note off" messages.
- **getVelocity(data: Uint8Array)**: Get the velocity from "Note On" and "Note off" messages as well as pedal messages.
- **getControllerNumber(data: Uint8Array)**: Get the controller number from a "Control Change" message.
- **getControllerValue(data: Uint8Array)**: Get the controller value from a "Control Change" message.
- **isControlChange(data: Uint8Array)**: Check if the message is a "Control Change".
- **isPolyphonicAftertouch(data: Uint8Array)**: Check if the message is a polyphonic aftertouch.
- **isPitchBend(data: Uint8Array)**: Check if the message is a pitch bend.
- **isProgramChange(data: Uint8Array)**: Check if the message is a program change.
- **isChannelAftertouch(data: Uint8Array)**: Check if the message is a channel aftertouch.
- **isSustainPedal(data: Uint8Array)**: Detect if the control change message is for the sustain pedal.
- **isSoftPedal(data: Uint8Array)**: Detect if the control change message is for the soft pedal.
- **isSostenutoPedal(data: Uint8Array)**: Detect if the control change message is for the sostenuto pedal.
- **isHighResVelocity(data: Uint8Array)**: Check if the message uses high-resolution velocity.
- **getHighResVelocity(data: Uint8Array)**: Extract the high-resolution velocity.
- **splitDataPayload(data: Uint8Array)**: Split a payload of MIDI data into individual messages.

## Types

The library includes the following types to help with handling MIDI messages:

- **MessageType**: Enum representing different MIDI message types (e.g., `NOTE_ON`, `CONTROL_CHANGE`, etc.).
- **ControlChangeMessageType**: Enum representing different control change message types (e.g., `SUSTAIN_PEDAL`, `SOFT_PEDAL`).
- **MidiNoteOnMessage**: Type for "Note On" messages.
- **MidiNoteOffMessage**: Type for "Note Off" messages.
- **MidiControlChangeMessage**: Type for "Control Change" messages.
- **MidiParserOptions**: Configuration options for the parser.

## License

This project is licensed under the MIT License.

## Contribution

Feel free to open issues or submit pull requests if you'd like to contribute or report any bugs.
