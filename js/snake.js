function Snake(data) {
	this.id = data.id;
	this.rows = 5;
	this.cols = 5;
	this.snakeStartLength = 3;
	this.snakeCoords = [];
	this.bookedCellClassName = 'booked';
	this.foodCellClassName = 'food';

	this.directions = {
		up: 0,
		right: 1,
		down: 2,
		left: 3
	}
	this.direction = 0;

	this.directionsClassNames = {
		up:'moveUp',
		right: 'moveRight',
		down: 'moveDown',
		left: 'moveLeft'
	}

	this.keyCodes = {
		up: 38,
		right: 39,
		down: 40,
		left: 37
	}

	this.inAction = false;

	this.gameInterval = null;

	this.extendSnake = false;

	this.foodCoords = {};

	this.score = 0;

	this.init();
}

Snake.prototype.init = function() {
	this.drawLayout();
	this.bindEvents();
}

Snake.prototype.drawLayout = function() {
	var html = '<div class="game">',
		i = 0,
		j,
		cellWidth = 100 / this.cols;

	html += this.makeTools() + 
		'<div class="gameField clear">';

	for (i; i < this.rows; i++) {
		j = 0;

		html += '<div class="row">';

		for (j; j < this.cols; j++) {
			html += '<div id="cell_' + j +'_' + i + '" style="width: ' + cellWidth + '%" class="cell"></div>';
		}

		html += '</div>';
	}

	html += '</div></div>';

	document.getElementById(this.id).innerHTML = html;
}

Snake.prototype.makeTools = function() {
	var html = '<div class="tools">' +
	'<button id="button">start</button>' +
	'<span id="score">0</span>' + 
	'</div>';

	return html;
}

Snake.prototype.makeSnake = function() {
	var i = 0,
		x = Math.ceil(this.cols/2),
		y = Math.ceil(this.rows/2) - 1,
		coords = {};

	for (i; i < this.snakeStartLength; i++) {
		y += 1;

		if (y == this.rows) {
			y = 0;
		} 

		coords = {x: x, y: y};

		this.snakeCoords.push(coords);
		this.drawBookedCell(coords);
	}

	console.dir(this.snakeCoords)
}

Snake.prototype.drawBookedCell = function(data) {
	var el = document.getElementById("cell_" + data.x + "_" + data.y);

	this.addClass(el, this.bookedCellClassName);

	if (data.cl) {
		this.addClass(el, data.cl);
	}
}

Snake.prototype.bindEvents = function (){
	var button = document.getElementById("button"),
		that = this;

	this.addEvent(button, 'click', function(e) {
		that.inAction = !that.inAction;

		if (that.inAction === true) {
			that.startGame();

			button.innerHTML = 'stop';
		} else {
			that.setDefaultState();

			button.innerHTML = 'start';
		}
	});

	this.addEvent(window, 'keydown', function(e) {
		if (e.keyCode === that.keyCodes.up) {
			if (that.direction !== that.directions.down) {
				that.direction = that.directions.up;
			}
		} else if (e.keyCode === that.keyCodes.right) {
			if (that.direction !== that.directions.left) {
				that.direction = that.directions.right;
			}
		} else if (e.keyCode === that.keyCodes.down) {
			if (that.direction !== that.directions.up) {
				that.direction = that.directions.down;
			}
		} else if (e.keyCode === that.keyCodes.left) {
			if (that.direction !== that.directions.right) {
				that.direction = that.directions.left;
			}
		}

		console.log('direction: '+that.direction);
	});
}

Snake.prototype.startGame = function (){
	this.makeSnake();
	this.addFood();
	this.addDirection();

	this.gameInterval = setInterval(this.drawNextFrame.bind(this), 1000);
}

Snake.prototype.drawNextFrame = function (){
	var lastSnakeCell = this.snakeCoords.pop(),
		snakeLength = this.snakeCoords.length,
		firstSnakeCell = this.snakeCoords[0],
		newFirstSnakeCell = {},
		tempCoord,
		i = 0;

	if (this.inAction === false) {
		return;
	}

	if (this.extendSnake === true) {
		this.extendSnake = false;

		this.addFood();

		if (lastSnakeCell) {
			this.snakeCoords.push(lastSnakeCell);
		}
	} else {
		if (lastSnakeCell) {
			this.removeClass(document.getElementById('cell_' + lastSnakeCell.x + '_'  + lastSnakeCell.y), this.bookedCellClassName);
		}
	}

	if (this.direction == this.directions.up) {

		newFirstSnakeCell.x = firstSnakeCell.x;

		tempCoord = firstSnakeCell.y - 1;

		if (tempCoord < 0) {
			tempCoord = this.rows - 1;
		}

		newFirstSnakeCell.y = tempCoord;

	} else if (this.direction == this.directions.right) {
		newFirstSnakeCell.y = firstSnakeCell.y;

		tempCoord = firstSnakeCell.x + 1;
		
		if (tempCoord == this.cols) {
			tempCoord = 0;
		}

		newFirstSnakeCell.x = tempCoord;
	} else if (this.direction == this.directions.down) {
		newFirstSnakeCell.x = firstSnakeCell.x;

		tempCoord = firstSnakeCell.y + 1;
		
		if (tempCoord == this.rows) {
			tempCoord = 0;
		}

		newFirstSnakeCell.y = tempCoord;

	} else if (this.direction == this.directions.left) {
		newFirstSnakeCell.y = firstSnakeCell.y;

		tempCoord = firstSnakeCell.x - 1;

		if (tempCoord < 0) {
			tempCoord = this.cols - 1;
		}

		newFirstSnakeCell.x = tempCoord;
	}

	for (i; i < snakeLength; i++) {
		if (this.snakeCoords[i].x == newFirstSnakeCell.x && this.snakeCoords[i].y == newFirstSnakeCell.y) {
			alert('game over!');
			this.setDefaultState();
			return;
		}
	}

	if (newFirstSnakeCell.x == this.foodCoords.x && newFirstSnakeCell.y == this.foodCoords.y) { 
		var food = document.getElementById("cell_" + this.foodCoords.x + "_" + this.foodCoords.y);

		this.removeClass(food, this.foodCellClassName);

		this.extendSnake = true;

		this.foodCoords = {};

		this.score += 1;

		document.getElementById("score").innerHTML = this.score;

		console.log('extend');
	}

	this.snakeCoords.unshift(newFirstSnakeCell);

	this.drawBookedCell(newFirstSnakeCell);

	console.log('new frame');
}

Snake.prototype.addFood = function (){
	var coords = {},
		newCoords = true,
		snakeLength = this.snakeCoords.length,
		i = 0;

	while(true) {
		coords = this.getCoordsForFood();

		newCoords = true;

		for (i; i < snakeLength; i++) {
			if (this.snakeCoords[i].x == coords.x && this.snakeCoords[i].y == coords.y) {
				newCoords = false;
			}
		}

		if (newCoords === true) {
			break;
		}
	}

	this.foodCoords.x = coords.x;
	this.foodCoords.y = coords.y;

	coords.cl = this.foodCellClassName;

	this.drawBookedCell(coords);

	console.log('food');
}

Snake.prototype.addDirection = function (clear){
	var el = document.getElementById("gameField");

	this.removeClass(el, this.directionsClassNames.up);
	this.removeClass(el, this.directionsClassNames.right);
	this.removeClass(el, this.directionsClassNames.down);
	this.removeClass(el, this.directionsClassNames.left);

	if (clear && clear === false) {

	} else {

	}
}

Snake.prototype.setDefaultState = function (){
	var snakeLength = this.snakeCoords.length,
		food = document.getElementById('cell_' + this.foodCoords.x + '_'  + this.foodCoords.y),
		i = 0;

	for (i; i < snakeLength; i++){
		this.removeClass(document.getElementById('cell_' + this.snakeCoords[i].x + '_'  + this.snakeCoords[i].y), this.bookedCellClassName);
	}

	this.removeClass(food, this.bookedCellClassName);
	this.removeClass(food, this.foodCellClassName);

	this.direction = 0;
	this.snakeCoords = [];
	this.inAction = false;
	this.foodCoords = {};
	this.extendSnake = false;
	this.score = 0;

	clearInterval(this.gameInterval);

	document.getElementById("button").innerHTML = 'start';
	document.getElementById("score").innerHTML = '0';
	
	console.log('clear');
}

Snake.prototype.getCoordsForFood = function () {
	var x = this.getRandomInt(0, this.cols - 1),
		y = this.getRandomInt(0, this.rows - 1);

	return {x: x, y: y};
}

Snake.prototype.getRandomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

Snake.prototype.addClass = function (o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    if (re.test(o.className)) return
    o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}
 
Snake.prototype.removeClass = function (o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}

Snake.prototype.addEvent =  function addEvent(elem, evType, fn) {
	if (elem.addEventListener) {
		elem.addEventListener(evType, fn, false);
	}
	else if (elem.attachEvent) {
		elem.attachEvent('on' + evType, fn);
	}
	else {
		elem['on' + evType] = fn;
	}
}



