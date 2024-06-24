# @bechstein/midi-parser

## Installation

Install `@bechstein/midi-parser` using npm:

```bash
npm install @bechstein/midi-parser
```

## Usage

```javascript
import { MidiParser, MidiMessageType } from '@bechstein/midi-parser';

const parser = new MidiParser({
  logMessages: true,
  enableHighResVelocity: true,
});

// register a subscriber
parser.subscribe((message) => {
    switch (message.type) {
       case MidiMessageType.NOTE_OFF:
       case MidiMessageType.NOTE_ON:
          console.log('Received MIDI note-on and note-off message:', message);
          break;
       case MidiMessageType.CONTROL_CHANGE:
          console.log('Received MIDI control change message:', message);
          break;
    }
});

//  request midi access
navigator.requestMIDIAccess().then((access) => {
  access.inputs.forEach((input) => {
    //  parsed messages will be dispatched to the subscribers
    input.onmidimessage = (message) => this.midiParser.parseMessage(message);
  });
});
```

## Development

The prerequisites for setting up your development environment can be found below:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bechstein/midi-parser.git
   cd midi-parser
   ```
2. **Install dependencies:**
   ```
   npm ci
   ```
