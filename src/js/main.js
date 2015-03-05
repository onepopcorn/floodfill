(function(){
	'use strict';
	var board      = document.querySelector('#gameboard'),
		ROWS       = 10,
		COLS       = 10,
		tiles      = [],
		NORMAL     = 0,
		WALL       = 1,
		START      = 2,
		PROCESSED  = 3,
		DIRECTIONS = [
			{"row":-1,"col":-1}, // Upper left tile
			{"row":-1,"col":0}, // Upper tile
			{"row":-1,"col":1}, // Upper right tile
			{"row":0,"col":1}, // Right tile
			{"row":+1,"col":+1}, // Right down tile
			{"row":+1,"col":0}, // Down tile
			{"row":+1,"col":-1}, // Down left tile
			{"row":0,"col":-1}, // Left tile
		];

	/******** tile class ********/
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
	// Tile class methods
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

	Tile.prototype.toggleWall = function(){
		if(this.type !== WALL)
			this.setType(WALL);
		else
			this.setType(NORMAL);
	};

	Tile.prototype.toggleStart = function(){
		// Only one start point at a time
		if(this.type !== START)
		{
			var el = document.querySelector('.start');
			if(el)
			{
				var coords = getCoordsFromIndex(el.id);
				tiles[coords[1]][coords[0]].setType(NORMAL);
			}
			this.setType(START);
		}
	};

	function clickHandler(e) {
		var coords = getCoordsFromIndex(e.currentTarget.id);
		tiles[coords[1]][coords[0]].toggleWall();
	}

	function contextHandler(e){
		e.preventDefault();
		var coords = getCoordsFromIndex(e.currentTarget.id);
		tiles[coords[1]][coords[0]].toggleStart();
		return;
	}

	// Initialize board
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
	}

	function start(){
		var el = document.querySelector('.start'),
			coords = getCoordsFromIndex(el.id),
			node = tiles[coords[1]][coords[0]];
			// Must reset the start node type to enable the flood algorithm
			node.type = NORMAL;
		
		floodfill(node,NORMAL,PROCESSED);
	}
	// Params: Current analized node type | color that can be replaced | color to replace with 
	function floodfill(node,targetType,replacementType){
		// Get current type
		if(targetType == replacementType){
			console.log('target type and replacement type are the same');
			return;
		}

		if(node.type != targetType){
			console.log('current type is differents than target type');
			return;
		}
		// Do here whatever you want
		node.setType(PROCESSED);

		// Do floodfill recursively in 8 directions
		/*for(var i in DIRECTIONS)
		{
			var dir = DIRECTIONS[i],
				nextRow = coords[0] + dir.row,
				nextCol = coords[1] + dir.col;
			if(isInBounds(nextRow,nextCol))
			{
				floodfill([nextRow,nextCol],NORMAL,PROCESSED);
			}
		}*/
		return;
	}

	function isInBounds(row,col){
		return row >= 0 && row < ROWS && col >= 0 && col < COLS;
	}

	function getCoordsFromIndex(idx){
		var col = Math.floor(idx / COLS),
			row = idx - col * ROWS;
		return [row,col];
	}

	function getIndexFromCoords(row,col){
		var idx = row * ROWS + col; 
		return idx;
	}
	// Entry point
	init();
})();