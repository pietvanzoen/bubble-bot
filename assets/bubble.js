
var GRID_WIDTH = 25;
var GRID_HEIGHT = 16;

// var logger = makeLogger(document.querySelector('.log'));
var bot = document.querySelector('.bot');
var __slice = Array.prototype.slice;

var goEast = partial(moveBotEast, bot, 1);
var goWest = partial(moveBotEast, bot, -1);
var goSouth = partial(moveBotSouth, bot, 1);
var goNorth = partial(moveBotSouth, bot, -1);

document.addEventListener('keydown', function (event) {
  var onKey = funkey(event);
  onKey('up', goNorth);
  onKey('right', goEast);
  onKey('down', goSouth);
  onKey('left', goWest);
});


function moveBotEast(bot, steps) {
  var currentPosition = botPosition(bot, 'left') || 0;
  var newPosition = currentPosition + steps;
  if (newPosition < 0) {
    newPosition = GRID_WIDTH - 1;
  }
  newPosition = fold(newPosition, GRID_WIDTH);
  bot.style.left = newPosition + 'em';
}

function moveBotSouth(bot, steps) {
  var currentPosition = botPosition(bot, 'top') || 0;
  var newPosition = currentPosition + steps;
  if (newPosition < 0) {
    newPosition = GRID_HEIGHT - 1;
  }
  newPosition = fold(newPosition, GRID_HEIGHT);
  bot.style.top = newPosition + 'em';
}

function botPosition(bot, direction) {
  var pos = bot.style[direction];
  return Number(pos.substring(0, pos.indexOf('em')));
}

function fold(num, foldPoint) {
  return num < foldPoint ? num : fold(num - foldPoint, foldPoint);
}

function partial(func, arg) {
  var args = __slice.call(arguments, 1);
  return function() {
    return func.apply(this, args.concat(__slice.call(arguments)));
  }
}

function makeLogger(element) {
  var list = [];
  return function log(newMessage) {
    newMessage = JSON.stringify(newMessage);
    list.push(newMessage);
    element.innerHTML = list.join('<br>');
  }
}
