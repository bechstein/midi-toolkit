import { Component } from '@angular/core';
import { MidiParser } from '@bechstein/midi-parser';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly midiParser = new MidiParser({
    logMessages: true,
    enableHighResVelocity: false,
  });

  constructor() {
    this.midiParser.subscribe((message) => console.log(message));
    navigator.requestMIDIAccess().then((access) => {
      access.inputs.forEach((input) => {
        input.onmidimessage = (message) => this.midiParser.parseMessage(message);
      });
    });
  }
}