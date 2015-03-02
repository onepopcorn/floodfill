(function(){
	var board = document.querySelector('#gameboard'),
		ROWS = 10,
		COLS = 10,
		TOTAL_TILES = ROWS * COLS;

	var clickHandler = function(e){
		swapClass(e.currentTarget,"wall");
	};

	var contextHandler = function(e){
		e.preventDefault();
		for(var i=0;i<TOTAL_TILES;i++){
			removeClass(board.children[i],"start");
		}

		removeClass(e.currentTarget,"wall");
		swapClass(e.currentTarget,"start");
		return;
	};

	// Initialize board
	var init = function(){
		for(var i=0;i<TOTAL_TILES;i++)
		{
			var el = document.createElement('div');
			el.id = i;
			el.className = 'tile';

			el.addEventListener("click",clickHandler);
			el.addEventListener("contextmenu",contextHandler);
			board.appendChild(el);

			// This is used to adjust rows/colums  number
			board.style.width = ROWS * 30 + "px";
		}
	};
	// Switch wall class for selected tile
	var swapClass = function(el,classname){
		var classes = el.className.split(" ");
		
		if(classes.indexOf(classname) === -1)
		{
		 	classes.push(classname);
		} else {
			var i = classes.indexOf(classname);
			classes.splice(i,1);
		}

		el.className = classes.join(" ");
	};

	var removeClass = function(el,classname){
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