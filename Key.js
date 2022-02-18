class Key {
  constructor(chr, col, keyboard) {
    this.chr = chr;
    this.col = col;
    this.keyboard = keyboard;
    this.x_size = (width - 2 * keyboard_left_buffer - (keyboard.chrs.length - 1) * keyboard.spacing) / keyboard.chrs.length;
    this.y_size = key_height;
    this.highlighted = false;
    this.x = keyboard_left_buffer + this.col * (this.x_size + keyboard.spacing);
    this.y = height - this.y_size - keyboard.bottom_start;
  }
  display() {
    noStroke();
    var fill_color = key_unhighlighted;
    if (this.highlighted) {
      fill_color = key_highlighted;
    }
    fill(fill_color);
    rect(this.x, this.y, this.x_size, this.y_size, key_radius, key_radius, key_radius, key_radius);
    textAlign(CENTER, CENTER);
    stroke(0);
    strokeWeight(0);
    fill(0);
    textSize(this.y_size * 2 / 3);
    text(this.chr, this.x + this.x_size / 2, this.y + this.y_size / 2);
  }
}
