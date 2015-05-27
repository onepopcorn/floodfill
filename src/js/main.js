(function(){
	'use strict';
	var board        = document.querySelector('#gameboard'),
		processQueue = [],
		animID       = null,
		ROWS         = 10,
		COLS         = 10,
		tiles        = [],
		NORMAL       = 0,
		WALL         = 1,
		START        = 2,
		PROCESSED    = 3,
		DIRECTIONS   = [
			{"row":-1,"col":-1}, // Upper left tile
			{"row":-1,"col":0}, // Upper tile
			{"row":-1,"col":1}, // Upper right tile
			{"row":0,"col":1}, // Right tile
			{"row":+1,"col":+1}, // Right down tile
			{"row":+1,"col":0}, // Down tile
			{"row":+1,"col":-1}, // Down left tile
			{"row":0,"col":-1}, // Left tile
		];


	/**
	 * @class Tile 
	 * @param {Number} id
	 */
	var Tile = function(id){
		// Setup type
		this.type = NORMAL;
		// Create DOM element
		this.el = document.createElement('div');
		this.el.className = 'tile';
		this.el.id = id;
		// Bind events
		this.el.addEventListener('click',clickHandler);
		this.el.addEventListener('contextmenu',contextHandler);
	};
	/** 
	 * @method Used to set a type & update style to selected tile
	 * @param {String} type 
	 */
	Tile.prototype.setType = function(type){
		var classname;
		switch(type){
			case WALL:
				classname = 'tile wall';
				break;
			case PROCESSED:
				classname = 'tile processed';
				break;
			case START:
				classname = 'tile start';
				break;
			default:
				classname = 'tile';
		}
		this.el.className = classname;
		this.type = type;
	};
	/** 
	 * @method Toggles wall on selected tile 
	 */
	Tile.prototype.toggleWall = function(){
		if(this.type !== WALL)
			this.setType(WALL);
		else
			this.setType(NORMAL);
	};
	/** 
	 * @method Toggles start position to selected tile
	 */
	Tile.prototype.toggleStart = function(){
		// Only one start point at a time
		if(this.type !== START)
		{
			var el = document.querySelector('.start');
			if(el)
			{
				var coords = getCoordsFromIndex(el.id);
				tiles[coords[0]][coords[1]].setType(NORMAL);
			}
			this.setType(START);
		}
	};
	/** 
	 * @function {Event} e Callback to click event 
	 */
	function clickHandler(e) {
		var coords = getCoordsFromIndex(e.currentTarget.id);
		tiles[coords[0]][coords[1]].toggleWall();
	}
	/** 
	 * @function {Event} e Callback to right mouse button click
	 */
	function contextHandler(e){
		e.preventDefault();
		var coords = getCoordsFromIndex(e.currentTarget.id);
		tiles[coords[0]][coords[1]].toggleStart();
		return;
	}
	/** 
	 * @function Initialize the experiment 
	 */
	function init(){
		// Set board size
		board.style.width = COLS * 30 + "px";
		// Create tiles
		for(var i=0;i<ROWS;i++)
		{
			tiles.push([]);
			for(var j=0;j<COLS;j++)
			{
				var t = new Tile(i * ROWS + j);
				board.appendChild(t.el);
				tiles[i].push(t);
			}
		}
		// bind start button
		document.querySelector('#startBtn').addEventListener('click',start);
		// bind reset button
		document.querySelector('#resetBtn').addEventListener('click',reset);
	}
	/** 
	 * @function Starts the algorhitm when clicked on start button
	 */
	function start(){
		var el = document.querySelector('.start');
			if(el === null){return;}
		
		var	coords = getCoordsFromIndex(el.id),
			tile = tiles[coords[0]][coords[1]];
			// Must reset the start node type to enable the flood algorithm
			tile.type = NORMAL;
			processTile(coords[0],coords[1]);
			render();
			// var interval = setInterval(function(){
			// 	var tile = processQueue[0];
			// 	tile.setType(PROCESSED);
			// 	processQueue.shift();
			// 	if(processQueue.length===0)
			// 	{
			// 		clearInterval(interval);
			// 	}
			// },10);
	}
	/**
	 * @function Set a tile as processed & call for process near tiles
	 */
	function processTile(row,col){
		var tile = tiles[row][col];
		// tile.setType(PROCESSED);
		tile.type = PROCESSED;
		processQueue.push(tile);
		processNearTiles(row,col);
	}
	/**
	 * @function Process near tails at given coords
	 */
	function processNearTiles(row,col){
		for(var i in DIRECTIONS)
		{
			var dir = DIRECTIONS[i];
			if(!isInBounds(row + dir.row, col + dir.col))
			{
				continue;
			}
			var tile = tiles[row + dir.row][col + dir.col];
			
			if(tile.type !== NORMAL)
			{
				continue;
			}

			if(tile.type !== PROCESSED)
			{
				processTile(row+dir.row,col+dir.col);
			}
		}
	}
	/**
	 * @function Render function to draw tiles
	 */
	 function render(){
	 	// Keep track of animation ID
	 	animID = requestAnimationFrame(render);
	 	// Process one tile per frame & remove it from queue
	 	var tile = processQueue[0];
		tile.setType(PROCESSED);
		processQueue.shift();
		// If no more tiles to process, stop animaiton
		if(processQueue.length===0)
		{
			cancelAnimationFrame(animID);
	 	}
	 }
	/**
	 * @function Used to reset everthign to initial values
	 */
	 function reset(){
	 	for(var i=0;i<ROWS;i++)
	 	{
	 		for(var j=0;j<COLS;j++)
	 		{
	 			var tile = tiles[i][j];
	 			tile.setType(NORMAL);
	 		}
	 	}
	 	// for(var i=0;i<ROWS;i++)
	 	// {
	 	// 	tiles.push([]);
	 	// 	for(var j=0;j<COLS;j++)
	 	// 	{
	 	// 		var t = new Tile(i * ROWS + j);
	 	// 		board.appendChild(t.el);
	 	// 		tiles[i].push(t);
	 	// 	}
	 	// }
	 }
	/** 
	 * @function Helper function to check if analized position exists
	 * @param {Number} row
	 * @param {Number} col
	 */
	function isInBounds(row,col){
		return row >= 0 && row < ROWS && col >= 0 && col < COLS;
	}
	/** 
	 * @function Gets coordinates for given tile index 
	 * @param {Number} idx Index from selected tile
	 * @return {Array} Array with row and column values
	 */
	function getCoordsFromIndex(idx){
		var row = Math.floor(idx / COLS),
			col = idx - row * ROWS;
		return [row,col];
	}
	/** 
	 * @function Gets tile index from given coordinates 
	 * @param {Number} row
	 * @param {Number} col
	 * @return {Array} Array with row and column values
	 */
	function getIndexFromCoords(row,col){
		var idx = row * ROWS + col; 
		return idx;
	}
	// Entry point
	init();
})();

/**
 * Request Animation Frame polyfill 
 * http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/ 
 */
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());