function Snake(data) {
	this.id = data.id;
	this.rows = 10;
	this.cols = 10;
	this.snakeStartLength = 6;
	this.snakeCoords = [];
	this.bookedCellClassName = 'booked';

	this.directions = {
		up: 0,
		right: 1,
		down: 2,
		left: 3
	}
	this.direction = 0;

	this.init();
}

Snake.prototype.init = function() {
	this.drawLayout();
	this.makeSnake();
	this.bindEvents();
}

Snake.prototype.drawLayout = function() {
	var html = '<div class="game">',
		i = 0,
		j,
		cellWidth = 100 / this.cols;

	html += this.makeTools();

	for (i; i < this.rows; i++) {
		j = 0;

		html += '<div class="row">';

		for (j; j < this.cols; j++) {
			html += '<div id="cell_' + j +'_' + i + '" style="width: ' + cellWidth + '%" class="cell"></div>';
		}

		html += '</div>';
	}

	html += '</div>';

	document.getElementById(this.id).innerHTML = html;
}

Snake.prototype.makeTools = function() {
	var html = '<div class="tools">' +
	'<button id="button">start</button>' +
	'<span id="score"></span>' + 
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
}

Snake.prototype.bindEvents = function (){
	var button = document.getElementById("button");

	this.addEvent(button, 'click', function(e) {

	});
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



