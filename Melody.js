class Melody {
  constructor(notes, velocity, dur) {
    this.notes = notes;
    this.velocity = velocity;
    this.dur = dur;
    this.formatted_notes = [];
    // for (let i = 0; i < notes.length; i++) {
    //   var quality = '';
    //   if (notes[i].length > 1) {
    //     quality = notes[i][0];
    //   }
    //   quality += default_scale[notes[i][notes.length - 1] - 1];
    //   this.formatted_notes.push(quality);
    // }
    this.frame_count = 0;
    this.current_note = -1;
  }
  play_note() {
    monoSynth.play(this.notes[this.current_note], this.velocity, 0, this.dur[this.current_note]);
    countdown = melody_wait_time;
  }
}
