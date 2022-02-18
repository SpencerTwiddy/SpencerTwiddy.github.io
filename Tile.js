class Tile {
  constructor(row, col, grid) {
    this.row = row;
    this.col = col;
    this.grid = grid;
    this.size = min((width - 2 * left_buffer - (grid.cols - 1) * grid.spacing) / grid.cols, (height - 2 * top_buffer - 2 * key_height - keyboard_bottom_buffer - keyboard_inner_spacing - (grid.rows - 1) * grid.spacing) / grid.rows);
    this.start = (width - (this.size + grid.spacing) * grid.cols) / 2;
    this.chr = '';
    this.color = 0;
    this.fill = tile_colors[0];
    this.x = this.start + this.col * (this.size + grid.spacing);
    this.y = top_buffer + this.row * (this.size + grid.spacing);
  }
  display() {
    stroke(200);
    strokeWeight(2);
    if (this.color != 0) {
      noStroke();
    }
    this.fill = tile_colors[this.color];
    fill(this.fill);
    rect(this.x, this.y, this.size);
    textAlign(CENTER, CENTER);
    stroke(0);
    strokeWeight(1);
    fill(0);
    if (this.color != 0) {
      stroke(255);
      fill(255);
    }
    textSize(this.size * 3 / 4);
    var y_correction = 1;
    if (this.chr.length == 2) {
      textSize(this.size / 2);
      text(this.chr[0], this.x + this.size / 4, y_correction + this.y + this.size / 2);
      textSize(this.size * 3 / 4);
      text(this.chr[1], this.x + this.size * 0.65, y_correction + this.y + this.size / 2);
    } else {
      text(this.chr, this.x + this.size / 2, y_correction + this.y + this.size / 2);
    }
  }
}
