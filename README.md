# @bechstein/midi-parser

## Installation

Install `@bechstein/midi-parser` using npm:

```bash
npm install @bechstein/midi-parser
```

## Usage

```javascript
import { MidiParser } from '@bechstein/midi-parser';

const parser = new MidiParser({
  logMessages: true,
  enableHighResVelocity: true
});

// register a subscriber
parser.subscribe(message => console.log('Received MIDI message:', message));

//  request midi access
navigator.requestMIDIAccess()
    .then((access) => {
        access.inputs.forEach((input) => {
            //  parsed messages will be dispatched to the subscribers
            input.onmidimessage = (message) => this.midiParser.parseMessage(message);
        })
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
