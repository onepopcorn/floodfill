(function(){
	'use strict';
	var board = document.querySelector('#gameboard'),
		ROWS = 10,
		COLS = 10,
		TOTAL_TILES = ROWS * COLS;

	function clickHandler(e) {
		swapClass(e.currentTarget,"wall");
	}

	function contextHandler(e){
		e.preventDefault();
		for(var i=0;i<TOTAL_TILES;i++){
			removeClass(board.children[i],"start");
		}

		removeClass(e.currentTarget,"wall");
		swapClass(e.currentTarget,"start");
		return;
	}

	// Initialize board
	function init(){
		// Set board size
		board.style.width = COLS * 30 + "px";
		// Create tiles
		for(var i=0;i<TOTAL_TILES;i++)
		{
			var el = document.createElement('div');
			el.id = i;
			el.className = 'tile';

			el.addEventListener("click",clickHandler);
			el.addEventListener("contextmenu",contextHandler);
			board.appendChild(el);
		}
		
	}

	function start(){

	}

	function floodfill(element,currentType,targetType){
		if(currentType == targetType){
			return;
		}

		if(element.type != targetType){
			return;
		}
		// Do here whatever you want

		// Do floodfill recursively in 8 directions
		// pseudo-code: for each direction do floodfill(); 

		return;
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
		var classes = el.className.split(" "),
			i = classes.indexOf(classname);
		if(i !== -1)
		{
			classes.splice(i,1);
			console.log(classes);
			el.className = classes.join(" ");
		}
	}
	// Entry point
	init();
})();