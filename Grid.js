class Grid {
  constructor(rows, cols, spacing) {
    this.rows = rows;
    this.cols = cols;
    this.spacing = spacing;
    this.tiles = [];
  }
  generate_tiles() {
    for (let i = 0; i < this.rows; i++) {
      this.tiles.push([])
      for (let j = 0; j < this.cols; j++) {
        this.tiles[i].push(new Tile(i, j, this));
      }
    }
  }
}
