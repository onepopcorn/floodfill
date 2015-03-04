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

	function clickHandler(e) {
		swapClass(e.currentTarget,"wall");
	}

	function contextHandler(e){
		e.preventDefault();
		removeClass(document.querySelector('.start'),"start");

		removeClass(e.currentTarget,"wall");
		swapClass(e.currentTarget,"start");
		return;
	}

	// Initialize board
	function init(){
		// Set board size
		board.style.width = COLS * 30 + "px";
		// Create tiles
		for(var i=0;i<ROWS;i++)
		{
			tiles.push([])
			for(var j=0;j<COLS;j++)
			{
				// Create DOM elements & style it
				var el = document.createElement('div');
				el.id = i * ROWS + j;
				el.className = 'tile';
				// Bind events to the element
				el.addEventListener("click",clickHandler);
				el.addEventListener("contextmenu",contextHandler);
				board.appendChild(el);
				// Create tiles array 
				tiles[i].push(NORMAL);
			}
		}
		// bind start button
		document.querySelector('#startBtn').addEventListener('click',start);
	}

	function start(){
		var startNode = document.querySelector('.start'),
			coords = getCoordsFromIndex(startNode.id);
		
		floodfill(coords,NORMAL,PROCESSED);
	}
	// Params: Current analized node type | color that can be replaced | color to replace with 
	function floodfill(currentTypeCoords,targetType,replacementType){
		// Get current type
		var currentType = tiles[currentTypeCoords[0]][currentTypeCoords[1]];
		
		console.log(currentType,targetType,replacementType);
		if(targetType == replacementType){
			console.log('target type and replacement type are the same');
			return;
		}

		if(currentType != targetType){
			console.log('current type is differents than target type');
			return;
		}
		// Do here whatever you want
		

		// Do floodfill recursively in 8 directions
		for(var i in DIRECTIONS)
		{
			var dir = DIRECTIONS[i],
				nextRow = currentTypeCoords[0] + dir.row,
				nextCol = currentTypeCoords[1] + dir.col;
				if(isInBounds(nextRow,nextCol))
				{
					floodfill([nextRow,nextCol],NORMAL,PROCESSED);
				}
		}

		return;
	}

	function isInBounds(row,col){
		return row >= 0 && row < ROWS && col >= 0 && col < COLS;
	};

	function getCoordsFromIndex(idx){
		var col = Math.floor(idx / COLS),
			row = idx - col * ROWS;
		return [row,col];
	}

	function getIndexFromCoords(row,col){
		var idx = row * ROWS + col; 
		return idx;
	}

	// Switch wall class for selected tile
	function swapClass(el,classname){
		var classes = el.className.split(" ");
		
		if(classes.indexOf(classname) === -1)
		{
		 	classes.push(classname);
		} else {
			var i = classes.indexOf(classname);
			classes.splice(i,1);
		}

		el.className = classes.join(" ");
	}

	function removeClass(el,classname){
		if(!el)
		{
			return;
		}

		var classes = el.className.split(" "),
			i = classes.indexOf(classname);
		if(i !== -1)
		{
			classes.splice(i,1);
			el.className = classes.join(" ");
		}
	}
	// Entry point
	init();
})();