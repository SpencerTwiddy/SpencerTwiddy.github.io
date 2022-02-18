function setup() {
  createCanvas(windowWidth, windowHeight - 1);
  textAlign(CENTER, CENTER);
  frame_rate = 30;
  frameRate(frame_rate);

  left_buffer = width / 20;
  top_buffer = width / 50;
  key_height = min(width / 10, 50);
  inner_spacing = 8;
  keyboard_left_buffer = width / 32;
  keyboard_bottom_buffer = width / 22;
  keyboard_inner_spacing = width / 80;
  key_radius = width / 80;
  current_year = year();
  current_month = month();
  current_day = day();
  tile_colors = [color(255), color(123), color(218, 59, 33), color(0, 178, 0), color(253, 213, 48), color(255, 139, 0)];
  key_highlighted = color(237, 34, 93);
  key_unhighlighted = color(211, 214, 218);
  instructions_y_buffer = width / 10;
  instructions_x_buffer = width / 15;
  instructions_text_size = 18;
  
  standardize_melodies();
  new_game();
  display_instructions();
}

var allowed_guesses = 6;
var grid;
var melody_length;
var inner_spacing;
var left_buffer;
var top_buffer;
var keyboard;
var keyboard_left_buffer;
var keyboard_bottom_buffer;
var number_keys = ["1", "2", "3", "4", "5", "6", "7"];
var special_keys = ["♭", "♯", "?", "←", "GO"];
var key_radius;
var key_highlighted;
var key_unhighlighted;
var cursor_position = [0, 0];
var sharp_keyCode = 187;
var flat_keyCode = 189;
var cant_flat = [1, 4];
var cant_sharp = [3, 7];
var current_year;
var current_month;
var current_day;
var secret_melody;
var days_since_first;
var first_year = 2022;
var first_month = 2;
var first_day = 12;
var days_per_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var key_height;
var game_over = false;
var victory = false;
var showing_instructions = true;
var instructions_lines = ['Can you guess the secret melody?', 'Touch anywhere to skip instructions', '', 'The same as in Wordle', 'This note is off by a perfect fifth', 'This note is Yellow and Red at the same time'];
var instructions_x_buffer;
var instructions_y_buffer;
var instructions_text_size;
var instructions_colors = [1, 3, 4, 0, 2, 5, 5, 0];
var instructions_chrs = ['♯5', '6', '♭3', '♯1', '♯1', '♯4', '5', '♯1'];
var sharp_enharmonics = ['1', '♯1', '2', '♯2', '3', '4', '♯4', '5', '♯5', '6', '♯6', '7'];
var flat_enharmonics = ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7'];
var tile_colors;
var share_squares = ['⬜', '⬛', '🟥', '🟩', '🟨', '🟧'];
var game_name = 'Twiddle';
var melodies_in_order = [['♭3', '2', '♭3', '1', '2', '♭7', '1', '1'], ['1', '1', 'b3', '1', '♭7', '♭6', '5'], ['b3','5','2','b3','1','2','b7','6'], ['5', '5', '6', '5', '1', '7'], ['5','b5','4','b3','3'], ['5', '5', '5', '1', '3'], ['5', '1', '2', 'b3', '4', 'b3', '5'], ['1', '1', '5', '5', '6', '6', '5'], ['1', 'b3', '1', '1', '4', '1', 'b7']];
var monoSynth = new p5.MonoSynth();
var default_scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
var countdown = 0;
var melody_wait_time;
var note_length = 1/6;
var frame_rate;

function standardize_melodies() {
  for (let i = 0; i < melodies_in_order.length; i++) {
    for (let j = 0; j < melodies_in_order[i].length; j++) {
      if (melodies_in_order[i][j].charAt(0) == 'b') {
        melodies_in_order[i][j] = '♭' + melodies_in_order[i][j].charAt(1);
      }
      if (melodies_in_order[i][j].charAt(0) == '#') {
        melodies_in_order[i][j] = '♯' + melodies_in_order[i][j].charAt(1);
      }
    }
  }
}

function new_game() {
  secret_melody = get_secret_melody(current_year, current_month, current_day);
  melody_length = secret_melody.length;
  melody_wait_time = 1 / note_length * frame_rate;
  grid = new Grid(allowed_guesses, melody_length, inner_spacing);
  grid.generate_tiles();
  keyboard_1 = new Keyboard(special_keys, keyboard_inner_spacing, keyboard_bottom_buffer + keyboard_inner_spacing + key_height);
  keyboard_1.generate_keys();
  keyboard_2 = new Keyboard(number_keys, keyboard_inner_spacing, keyboard_bottom_buffer);
  keyboard_2.generate_keys();
}

function display_grid() {
  for (let i = 0; i < grid.tiles.length; i++) {
    for (let j = 0; j < grid.tiles[0].length; j++) {
      grid.tiles[i][j].display();
    }
  }
}

function display_keyboard(board) {
  for (let i = 0; i < board.keys.length; i++) {
    board.keys[i].display();
  }
}

function mouse_on_flat(x, y) {
  var flat = keyboard_1.keys[0];
  if (x < flat.x) return false;
  if (y < flat.y) return false;
  if (x > flat.x + flat.x_size) return false;
  if (y > flat.y + flat.y_size) return false;
  return true;
}

function mouse_on_sharp(x, y) {
  var sharp = keyboard_1.keys[1];
  if (x < sharp.x) return false;
  if (y < sharp.y) return false;
  if (x > sharp.x + sharp.x_size) return false;
  if (y > sharp.y + sharp.y_size) return false;
  return true;
}

function mouse_on_help(x, y) {
  var backspace = keyboard_1.keys[2];
  if (x < backspace.x) return false;
  if (y < backspace.y) return false;
  if (x > backspace.x + backspace.x_size) return false;
  if (y > backspace.y + backspace.y_size) return false;
  return true;
}

function mouse_on_backspace(x, y) {
  var backspace = keyboard_1.keys[3];
  if (x < backspace.x) return false;
  if (y < backspace.y) return false;
  if (x > backspace.x + backspace.x_size) return false;
  if (y > backspace.y + backspace.y_size) return false;
  return true;
}

function mouse_on_go(x, y) {
  var go = keyboard_1.keys[4];
  if (x < go.x) return false;
  if (y < go.y) return false;
  if (x > go.x + go.x_size) return false;
  if (y > go.y + go.y_size) return false;
  return true;
}

function mouse_on_number(x, y) {
  var number = keyboard_2.keys[0];
  if (y < number.y) return -1;
  if (y > number.y + number.y_size) return -1;
  for (let i = 0; i < number_keys.length; i++) {
    number = keyboard_2.keys[i];
    if (x > number.x && x < number.x + number.x_size) return i + 1;
  }
  return 0;
}

function handle_click(x, y) {
  if (mouse_on_flat(x, y)) {
    handle_flat_click();
  }
  if (mouse_on_sharp(x, y)) {
    handle_sharp_click();
  }
  if (mouse_on_help(x, y)) {
    showing_instructions = true;
  }
  if (mouse_on_backspace(x, y)) {
    handle_backspace();
  }
  if (mouse_on_go(x, y)) {
    handle_enter();
  }
  var on_number = mouse_on_number(x, y);
  if (on_number > 0) {
    handle_number(on_number);
  }
}

function mousePressed() {
  if (game_over) return;
  instructions_melody.frame_count = 0;
  instructions_melody.current_note = -1;
  showing_instructions = false;
  handle_click(mouseX, mouseY);
}

function handle_flat_click() {
  var flat = keyboard_1.keys[0];
  var sharp = keyboard_1.keys[1];
  if (sharp.highlighted) {
    sharp.highlighted = false;
    flat.highlighted = true;
    return;
  }
  if (flat.highlighted) {
    flat.highlighted = false;
  } else {
    flat.highlighted = true;
  }
}

function handle_sharp_click() {
  var flat = keyboard_1.keys[0];
  var sharp = keyboard_1.keys[1];
  if (flat.highlighted) {
    flat.highlighted = false;
    sharp.highlighted = true;
    return;
  }
  if (sharp.highlighted) {
    sharp.highlighted = false;
  } else {
    sharp.highlighted = true;
  }
}

function handle_flat() {
  var flat = keyboard_1.keys[0];
  var sharp = keyboard_1.keys[1];
  if (!sharp.highlighted) {
    flat.highlighted = true;
  }
}

function handle_sharp() {
  var flat = keyboard_1.keys[0];
  var sharp = keyboard_1.keys[1];
  if (!flat.highlighted) {
    sharp.highlighted = true;
  }
}

function handle_number(number) {
  if (cursor_position[1] >= melody_length) return;
  if (keyboard_1.keys[0].highlighted) {
    if (cant_flat.includes(number)) return;
    grid.tiles[cursor_position[0]][cursor_position[1]].chr = "♭" + number;
  } else if (keyboard_1.keys[1].highlighted) {
    if (cant_sharp.includes(number)) return;
    grid.tiles[cursor_position[0]][cursor_position[1]].chr = "♯" + number;
  } else {
    grid.tiles[cursor_position[0]][cursor_position[1]].chr = number;
  }
  cursor_position[1]++;
}

function handle_backspace() {
  if (cursor_position[1] === 0) return;
  cursor_position[1]--;
  grid.tiles[cursor_position[0]][cursor_position[1]].chr = "";
}

function argOf(arr, element) {
  index = -1;
  for (let i = 0; i < arr.length; i++) {
    if (element == arr[i]) return i;
  }
  return index;
}

function off_by_perfect_fifth(enharmonic_index_1, enharmonic_index_2) {
  return abs((enharmonic_index_1 - enharmonic_index_2) % 12) == 5 || abs((enharmonic_index_1 - enharmonic_index_2) % 12) == 7;
}

function off_by_semitone(enharmonic_index_1, enharmonic_index_2) {
  return abs(enharmonic_index_1 - enharmonic_index_2) == 1;
}

function in_another_unknown_position(guess_enharmonic_index, all_guess_enharmonic_indexes, all_correct_enharmonic_indexes, wrong_spots_needed) {
  var found_so_far = 0;
  for (let i = 0; i < all_correct_enharmonic_indexes.length; i++) {
    if (guess_enharmonic_index == all_correct_enharmonic_indexes[i] && all_correct_enharmonic_indexes[i] != all_guess_enharmonic_indexes[i]) found_so_far++;
  }
  return (found_so_far > wrong_spots_needed);
}

function handle_enter() {
  if (cursor_position[1] < melody_length) return;
  var all_guess_enharmonic_indexes = [];
  var all_correct_enharmonic_indexes = [];
  for (let i = 0; i < grid.cols; i++) {
    all_guess_enharmonic_indexes.push(max(argOf(flat_enharmonics, grid.tiles[cursor_position[0]][i].chr), argOf(sharp_enharmonics, grid.tiles[cursor_position[0]][i].chr)));
    all_correct_enharmonic_indexes.push(max(argOf(flat_enharmonics, secret_melody[i]), argOf(sharp_enharmonics, secret_melody[i])));
  }
  var number_correct = 0;
  var wrong_spots = {};
  for (let i = 0; i < flat_enharmonics.length; i++) {
    wrong_spots[i] = 0;
  }
  for (let i = 0; i < grid.cols; i++) {
    var guess_enharmonic_index = max(argOf(flat_enharmonics, grid.tiles[cursor_position[0]][i].chr), argOf(sharp_enharmonics, grid.tiles[cursor_position[0]][i].chr));
    var correct_enharmonic_index = max(argOf(flat_enharmonics, secret_melody[i]), argOf(sharp_enharmonics, secret_melody[i]));
    if (guess_enharmonic_index == correct_enharmonic_index) {
      number_correct++;
      grid.tiles[cursor_position[0]][i].color = 3;
    } else if (off_by_perfect_fifth(guess_enharmonic_index, correct_enharmonic_index) && in_another_unknown_position(guess_enharmonic_index, all_guess_enharmonic_indexes, all_correct_enharmonic_indexes, wrong_spots[guess_enharmonic_index])) {
      grid.tiles[cursor_position[0]][i].color = 5;
      wrong_spots[guess_enharmonic_index]++;
    } else if (off_by_perfect_fifth(guess_enharmonic_index, correct_enharmonic_index)) {
      grid.tiles[cursor_position[0]][i].color = 2;
    } else if (in_another_unknown_position(guess_enharmonic_index, all_guess_enharmonic_indexes, all_correct_enharmonic_indexes, wrong_spots[guess_enharmonic_index])) {
      grid.tiles[cursor_position[0]][i].color = 4;
      wrong_spots[guess_enharmonic_index]++;
    } else {
      grid.tiles[cursor_position[0]][i].color = 1;
    }
  }
  if (number_correct == grid.cols) {
    game_over = true;
    victory = true;
  }
  cursor_position[1] = 0;
  if (cursor_position[0] + 1 == allowed_guesses) {
    game_over = true;
  }
  cursor_position[0]++;
  if (game_over) {
    var tries = 'X';
    if (victory) {
      tries = cursor_position[0];
    }
    createDiv(game_name + ' ' + days_since_first + ' ' + tries + '/' + allowed_guesses);
    createP('');
    for (let i = 0; i < cursor_position[0]; i++) {
      var share = '';
      for (let j = 0; j < grid.cols; j++) {
        share += share_squares[grid.tiles[i][j].color];
      }
      createDiv(share);
    }
  }
}

function get_secret_melody(year, month, day) {
  days_since_first = 0;
  var starting_month = first_month;
  var starting_day = first_day;
  for (let i = first_year; i <= year; i++) {
    for (let j = starting_month; j <= 12; j++) {
      for (let k = starting_day; k <= days_per_month[j - 1]; k++) {
        if (i === year && j === month && k === day) {
          return melodies_in_order[days_since_first];
            } else {
              days_since_first++;
            }
      }
      starting_day = 1;
    }
    starting_month = 1;
  }
}

function keyPressed() {
  if (game_over) return;
  showing_instructions = false;
  if (keyCode === flat_keyCode) {
    handle_flat();
  }
  if (keyCode === sharp_keyCode) {
    handle_sharp();
  }
  if (keyCode > 48 && keyCode < 56) {
    handle_number(keyCode - 48);
  }
  if (keyCode === 8) {
    handle_backspace();
  }
  if (keyCode === 13) {
    handle_enter();
  }
}

function keyReleased() {
  if (keyCode === flat_keyCode) {
    keyboard_1.keys[0].highlighted = false;
  }
  if (keyCode === sharp_keyCode) {
    keyboard_1.keys[1].highlighted = false;
  }
}

function display_instructions() {
  rectMode(CORNER);
  var instructions_available_x = width - 2 * instructions_x_buffer;
  var instructions_available_y = height - 2 * instructions_y_buffer;
  var each_y = instructions_available_y / instructions_lines.length;
  var instructions_grid = new Grid(allowed_guesses, melody_length, inner_spacing);
  for (let i = 0; i < instructions_lines.length; i++) {
    instructions_grid.tiles.push(new Tile(0, i, instructions_grid));
    instructions_grid.tiles[i].color = instructions_colors[i];
    var text_align = CENTER;
    var tile_adjustment = 0;
    if (i > 2) {
      text_align = LEFT;
      tile_adjustment = instructions_grid.tiles[i].size + instructions_grid.spacing;
      if (i == 3) {
        tile_adjustment = 3 * tile_adjustment;
        instructions_grid.tiles[0].x = instructions_x_buffer;
        instructions_grid.tiles[1].x = instructions_x_buffer + (tile_adjustment - 3 * instructions_grid.spacing) / 3 + instructions_grid.spacing;
        instructions_grid.tiles[2].x = instructions_x_buffer +  2 * (tile_adjustment - 3 * instructions_grid.spacing) / 3 + 2 * instructions_grid.spacing;
        instructions_grid.tiles[0].y = instructions_y_buffer + i * each_y;
        instructions_grid.tiles[1].y = instructions_y_buffer + i * each_y;
        instructions_grid.tiles[2].y = instructions_y_buffer + i * each_y;
        instructions_grid.tiles[0].display();
        instructions_grid.tiles[1].display();
        instructions_grid.tiles[2].display();
      } else {
        instructions_grid.tiles[i].x = instructions_x_buffer;
        instructions_grid.tiles[i].y = instructions_y_buffer + i * each_y;
        instructions_grid.tiles[i].display();
      }
    }
    textSize(instructions_text_size);
    stroke(0);
    strokeWeight(1);
    fill(0);
    textAlign(text_align, TOP);
    text(instructions_lines[i], instructions_x_buffer + tile_adjustment, instructions_y_buffer + i * each_y, width - 2 * instructions_x_buffer - tile_adjustment);
  }
  var note_length = instructions_melody.dur[0];
  if (instructions_melody.current_note > -1) {
    note_length = instructions_melody.dur[instructions_melody.current_note];
  }
  if (instructions_melody.frame_count % floor(frame_rate * note_length + 1) == 0 && instructions_melody.current_note < instructions_melody.notes.length - 1) {
    instructions_melody.current_note++;
    instructions_melody.play_note();
  }
  instructions_melody.frame_count++;
}

var default_velocity = 1;
var instructions_melody = new Melody(['Eb5', 'D5', 'Eb5', 'C5','Eb5', 'D5', 'Eb5', 'C5','Eb5', 'D5', 'Eb5', 'C5','Eb5', 'D5', 'Eb5', 'C5'], default_velocity, [1/4,1/8,1/8,1/4,1/4,1/8,1/8,1/4,1/4,1/8,1/8,1/4,1/4,1/8,1/8,1/4]);

function draw() {
  background(250);
  if (showing_instructions) {
    display_instructions();
  } else {
    display_grid();
    display_keyboard(keyboard_1);
    display_keyboard(keyboard_2);
  }
}
