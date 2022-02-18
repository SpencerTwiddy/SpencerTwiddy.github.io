class Keyboard {
  constructor(chrs, spacing, bottom_start) {
    this.chrs = chrs;
    this.spacing = spacing;
    this.keys = [];
    this.bottom_start = bottom_start;
  }
  generate_keys() {
    for (let i = 0; i < this.chrs.length; i++) {
      this.keys.push(new Key(this.chrs[i], i, this));
    }
  }
}
