# @bechstein/midi-toolkit

## Installation

Install `@bechstein/midi-toolkit` using npm:

```bash
npm install @bechstein/midi-toolkit
```

## Usage

```javascript
import { MidiParser, MessageType, MidiMessage } from '@bechstein/midi-toolkit';

const parser = new MidiParser({ enableHighResVelocity: true, });

// define a subscriber
const handler = (message: MidiMessage) => {
   switch (message.type) {
      case MessageType.NOTE_OFF:
      case MessageType.NOTE_ON:
         console.log('Received MIDI note-on and note-off message:', message);
         break;
      case MessageType.CONTROL_CHANGE:
         console.log('Received MIDI control change message:', message);
         break;
   }
};

// register a subscriber
parser.subscribe(handler);

// request midi access
navigator.requestMIDIAccess().then((access) => {
  access.inputs.forEach((input) => {
    input.onmidimessage = (message) => {
       // parsed messages will be dispatched to the subscribers
       parser.parseMessage(message);

       // or

       // directly parse the message and use it
       const parsedMessage = parser.instant(message);
       console.log(parsedMessage)
    };
  });
});

// remove a subscriber
parser.unsubscribe(handler);

// change parser configuration
parser.configure({ enableHighResVelocity: false });
```

## Development

The prerequisites for setting up your development environment can be found below:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bechstein/midi-toolkit.git
   cd midi-toolkit
   ```
2. **Install dependencies:**
   ```
   npm ci
   ```
