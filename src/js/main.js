(function(){
	'use strict';
	var board      = document.querySelector('#gameboard'),
		ROWS       = 10,
		COLS       = 10,
		tiles      = [],
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
				tiles[i].push(0);
			}
		}
		// bind start button
		document.querySelector('#startBtn').addEventListener('click',start);
	}

	function start(){
		var startNode = document.querySelector('.start');
		floodfill(startNode,startNode.className,'processed');
	}

	function floodfill(node,currentType,targetType){
		if(currentType == targetType){
			return;
		}

		if(node.type != targetType){
			return;
		}
		// Do here whatever you want
		swapClass(node,'processed');

		// Do floodfill recursively in 8 directions
		var coords = getCoordsFromIndex(node.id);
		for(var i in DIRECTIONS)
		{
			var dir = DIRECTIONS[i];

		}

		return;
	}

	function isInBounds(row,col){
		return row >= 0 && row < ROWS_NUM && col >= 0 && col < COLS_NUM;
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