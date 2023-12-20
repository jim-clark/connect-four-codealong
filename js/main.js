/*----- constants -----*/
const PLAYER_COLORS = {
  'null': 'white',
  '1': 'purple',
  '-1': 'lime'
};

/*----- state variables -----*/
let board;  // 2D Array; null -> cell not taken; 1/-1 -> which player/disc
let turn;   // 1/-1
let winner; // null -> game in progress; 1/-1 -> that player has won; 'T' -> tie

/*----- cached elements  -----*/
const msgEl = document.getElementById('msg');
const playAgainBtn = document.getElementById('play-again');
const markerEls = [...document.querySelectorAll('#markers > div')];

/*----- event listeners -----*/
document.getElementById('markers').addEventListener('click', handleDrop);
playAgainBtn.addEventListener('click', init);

/*----- functions -----*/
init();

// Initialize all state vars, then call render()
function init() {
  // To visualize the board, rotate the arrays below 
  // 90 degrees counter-clockwise
  board = [
    [null, null, null, null, null, null],  // col 0
    [null, null, null, null, null, null],  // col 1
    [null, null, null, null, null, null],  // col 2
    [null, null, null, null, null, null],  // col 3
    [null, null, null, null, null, null],  // col 4
    [null, null, null, null, null, null],  // col 5
    [null, null, null, null, null, null],  // col 6
  ];
  turn = 1;
  winner = null;
  render();
}

// Update all impacted state, then call render()
function handleDrop(evt) {
  const colIdx = markerEls.indexOf(evt.target);
  // guard
  if (colIdx === -1) return;
  const colArr = board[colIdx];
  const rowIdx = colArr.indexOf(null);
  colArr[rowIdx] = turn;
  winner = getWinner(colIdx, rowIdx);
  turn *= -1;
  render();
}

function getWinner(colIdx, rowIdx) {
  return checkVertical(colIdx, rowIdx) || checkHorizontal(colIdx, rowIdx)
    || checkForwardSlash(colIdx, rowIdx) || checkBackSlash(colIdx, rowIdx);
}

function checkBackSlash(colIdx, rowIdx) {
  const numLeft = countAdj(colIdx, rowIdx, -1, 1);
  const numRight = countAdj(colIdx, rowIdx, 1, -1);
  return (numLeft + numRight) >= 3 ? turn : null;

}
function checkForwardSlash(colIdx, rowIdx) {
  const numLeft = countAdj(colIdx, rowIdx, -1, -1);
  const numRight = countAdj(colIdx, rowIdx, 1, 1);
  return (numLeft + numRight) >= 3 ? turn : null;
}

function checkHorizontal(colIdx, rowIdx) {
  const numLeft = countAdj(colIdx, rowIdx, -1, 0);
  const numRight = countAdj(colIdx, rowIdx, 1, 0);
  return (numLeft + numRight) >= 3 ? turn : null;
}

function checkVertical(colIdx, rowIdx) {
  const numBelow = countAdj(colIdx, rowIdx, 0, -1);
  return numBelow === 3 ? turn : null;
}

function countAdj(colIdx, rowIdx, colOffset, rowOffset) {
  const cellVal = board[colIdx][rowIdx];
  let count = 0;
  colIdx += colOffset;
  rowIdx += rowOffset;
  while (board[colIdx] && board[colIdx][rowIdx] === cellVal) {
    count++;
    colIdx += colOffset;
    rowIdx += rowOffset;
  }
  return count;
}

// Visualize all state and other info (such as messages)
// in the DOM
function render() {
  renderBoard();
  renderMessage();
  renderControls();
}

function renderControls() {
  // ternary expression
  // <conditional expression> ? <truthy exp> : <falsy exp>
  playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
  markerEls.forEach(function(el, elIdx) {
    const showMarker = board[elIdx].includes(null);
    el.style.visibility = showMarker && !winner ? 'visible' : 'hidden';
  });
}

function renderMessage() {
  if (winner === null) {
    // game is in play
    msgEl.innerHTML = `<span style="color: ${PLAYER_COLORS[turn]}">${PLAYER_COLORS[turn].toUpperCase()}</span>'s Turn`;
  } else if (winner === 'T') {
    msgEl.innerText = 'It\'s a TIE❗️';
  } else {
    // A player has won
    msgEl.innerHTML = `<span style="color: ${PLAYER_COLORS[winner]}">${PLAYER_COLORS[winner].toUpperCase()}</span> Wins❗️`;
  }
}

function renderBoard() {
  board.forEach(function(colArr, colIdx) {
    colArr.forEach(function(cellVal, rowIdx) {
      const cellEl = document.getElementById(`c${colIdx}r${rowIdx}`);
      cellEl.style.backgroundColor = PLAYER_COLORS[cellVal];
    });
  });
}