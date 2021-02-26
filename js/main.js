/*----- constants -----*/
const colorLookup = {
  '0': 'white',
  '1': 'purple',
  '-1': 'lime'
};

/*----- app's state (variables) -----*/
let board, turn, winner;

/*----- cached element references -----*/
const msgEl = document.getElementById('msg');
const markerEls = [...document.querySelectorAll('#markers > div')];
const replayBtn = document.querySelector('button');

/*----- event listeners -----*/
document.getElementById('markers')
  .addEventListener('click', handleDrop);

replayBtn.addEventListener('click', init);

/*----- functions -----*/
init();

function handleDrop(evt) {
  // A marker has been clicked, update all
  // impacted state, call render
  
  // Get the index of the clicked marker (col)
  const colIdx = markerEls.indexOf(evt.target);
  if (colIdx === -1 || winner) return;
  const colArr = board[colIdx];
  // Find the first open cell (0) in the colArr
  const rowIdx = colArr.indexOf(0);
  if (rowIdx === -1) return;
  colArr[rowIdx] = turn;
  turn *= -1;
  winner = getWinner();
  render();
}

function getWinner() {
  let winner = null;
  for (let colIdx = 0; colIdx <= 6; colIdx++) {
    winner = checkCol(colIdx);
    if (winner) break;
  }
  // TODO: Add tie logic
  return winner;
}

function checkCol(colIdx) {
  const colArr = board[colIdx];
  for (let rowIdx = 0; rowIdx < colArr.length; rowIdx++) {
    let winner = checkUp(colArr, rowIdx);
    if (winner) return winner;
  }
  return null;
}

function checkUp(colArr, rowIdx) {
  // Boundary check
  if (rowIdx > 2) return null;
  
}

function init() {
  // Initialize all state
  board = [
    [0, 0, 0, 0, 0, 0],  // Column 0
    [0, 0, 0, 0, 0, 0],  // Column 1
    [0, 0, 0, 0, 0, 0],  // Column 2
    [0, 0, 0, 0, 0, 0],  // Column 3
    [0, 0, 0, 0, 0, 0],  // Column 4
    [0, 0, 0, 0, 0, 0],  // Column 5
    [0, 0, 0, 0, 0, 0],  // Column 6
  ];
  turn = 1;
  winner = null;
  render();
}

function render() {
  // Render the board
  board.forEach(function(colArr, colIdx) {
    // Iterate over the col array to access the cell vals
    colArr.forEach(function(cellVal, rowIdx) {
      // Select the correct div for this cellVal
      const div = document.getElementById(`c${colIdx}r${rowIdx}`);
      div.style.backgroundColor = colorLookup[cellVal];
    });
    // <conditional expression> ? <truthy val> : <falsey val>;
    markerEls[colIdx].style.visibility = colArr.includes(0) ? 'visible' : 'hidden';
  });
  // Render the msg
  if (winner === 'T') {
    msgEl.textContent = "It's a Tie!!!";
  } else if (winner) {
    // A player has won
    msgEl.innerHTML = `<span style="color: ${colorLookup[winner]}">${colorLookup[winner].toUpperCase()}</span> Wins!`;
  } else {
    // No winner yet, show whose turn
    msgEl.innerHTML = `<span style="color: ${colorLookup[turn]}">${colorLookup[turn].toUpperCase()}</span>'s Turn`;
  }
  replayBtn.style.visibility = winner ? 'visible' : 'hidden';
}