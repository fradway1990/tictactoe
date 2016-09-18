
//function used to resize elements on screen
function resizeBoard(){
	var boardwidth = $('.board').width();
	var boardHeight = $('.board').height(boardwidth);
	var squareWidth = $('.square').width();
	var squareHeight = $('.square').height(squareWidth);
	var splash = $('.splash');
	//if the splash height is less than the window height resize it
	if(splash.height() < $(window).height()){
		splash.height($(window).height());
	}
}

//when window is resized resize elements
window.onresize = function(){
	resizeBoard();
}


//the game board's object
function Board(boardId){
	
	//in the begining the current turn is undetermined
	this.currentTurn = '';
	this.board = [  0,0,0,
					0,0,0,
					0,0,0];
	this.boardId = boardId;
	
	//the svg for the x piece
	var x = '<div class="svg-bg p1"><svg class="svg-container" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="43.493px" height="38.956px" viewBox="0 0 43.493 38.956" enable-background="new 0 0 43.493 38.956" xml:space="preserve"><g class ="letter"><path d="M15.554,0l6.264,10.945L28.586,0h14.041L30.315,19.01l13.178,19.946H28.731l-6.913-11.881l-7.705,11.881H0L13.25,19.01 L0.864,0H15.554z"/></g></svg></div>';
	
	//the svg for the o piece
	var o ='<div class="svg-bg p2"><svg class="svg-container" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="42.556px" height="39.819px" viewBox="0 0 42.556 39.819" enable-background="new 0 0 42.556 39.819" xml:space="preserve"><g class="letter"><path d="M42.556,19.874c0,12.025-8.497,19.946-21.313,19.946C8.425,39.819,0,31.898,0,19.874C0,7.92,8.425,0,21.242,0 C34.059,0,42.556,7.92,42.556,19.874z M12.889,20.089c0,5.761,3.384,9.649,8.353,9.649c5.04,0,8.425-3.888,8.425-9.649 c0-5.833-3.385-9.721-8.425-9.721C16.273,10.369,12.889,14.257,12.889,20.089z"/></g></svg></div>';
	
	//the svg for the x and o piece without a background
	var xNoBg = '<svg class="svg-container" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="43.493px" height="38.956px" viewBox="0 0 43.493 38.956" enable-background="new 0 0 43.493 38.956" xml:space="preserve"><g class ="letter"><path d="M15.554,0l6.264,10.945L28.586,0h14.041L30.315,19.01l13.178,19.946H28.731l-6.913-11.881l-7.705,11.881H0L13.25,19.01 L0.864,0H15.554z"/></g></svg>';
	
	var oNoBg = '<svg class="svg-container" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="42.556px" height="39.819px" viewBox="0 0 42.556 39.819" enable-background="new 0 0 42.556 39.819" xml:space="preserve"><g class="letter"><path d="M42.556,19.874c0,12.025-8.497,19.946-21.313,19.946C8.425,39.819,0,31.898,0,19.874C0,7.92,8.425,0,21.242,0 C34.059,0,42.556,7.92,42.556,19.874z M12.889,20.089c0,5.761,3.384,9.649,8.353,9.649c5.04,0,8.425-3.888,8.425-9.649 c0-5.833-3.385-9.721-8.425-9.721C16.273,10.369,12.889,14.257,12.889,20.089z"/></g></svg>';
	
	//player 2 and player 2 are set to object literals
	this.player1 = {
				'score':100,
				'letterSVG':x,
				'letterNoBg':xNoBg
					};
	this.player2 = {
					'score':-100,
					'letterSVG':o,
					'letterNoBg':oNoBg
					};
}

//the init function for the board shows a splash screen and determines who will go first
Board.prototype.init = function(){
	this.splash('start');
	this.changeTurn();
	
}


//method used to create the game board
Board.prototype.createBoard = function(){
	//create game board
		
	//var to hold board
	var board = $('<div></div>',{
		'class':'board',
		'id':this.boardId
	});	
	
		
	//create 3 rows of 3 squares
		
	for(var i = 0 ; i < 3; i++){
		//var to hold row
		var row = $('<div></div>',{
			'class':'row'
		});
		row.appendTo(board);
		
		for(var j = 0; j < 3; j++){
			//var for squares on board
			var square = $('<div></div>',{
				'class':'square'
			});
			(function(_this){
				square.on('click',function(){
					_this.placeLetter(this, $('.square').index(this));
				});
				
					square.hover(function(){
						if(_this.board[$('.square').index(this)] === 0){
							if(_this.currentTurn === 1){
								$(this).html(_this.player1.letterNoBg);
							}
							if(_this.currentTurn === 2){
								$(this).html(_this.player2.letterNoBg);
							}
						}
					},
					function(){
						if(_this.board[$('.square').index(this)] === 0){
							$(this).html('');
						}
					}
				);
			})(this);
			square.appendTo(row);
		}
	}
	return board;
}


//method used to check if the game is over
Board.prototype.isGameOver = function(){
	//cycle through array and determine see if any values are equal to 0
	//if so return false
	var board = this.board;
	var result = '';
	//if there is no winner check for a cat
	if(! this.isWinner()){
		//condition for cat
		for(var x = 0; x < board.length; x++){
			if(board[x] === 0){
				break;
			}else{
				if(x === board.length - 1){
					if(board[x] != 0){
						result = 'tie';
						console.log(result);
					}
				}
			}
		}
		
	}else{
		//return the game winner
		result = this.isWinner();
		console.log(result);
	}
	
	if(result){
		var _this = this;
		setTimeout(function(){_this.splash('end');},500);
	}
	return result;
}


//method used to change turn
Board.prototype.changeTurn = function(){
	
	//do not change the turn if the game is over
	if(! this.isGameOver()){
		//if first turn: decide who starts
		if(this.currentTurn === ''){
			var randNum = Math.random();
			if(randNum > 0.5){
				this.currentTurn = 1;
				$('.turn').removeClass('active');
				$('.turn.player1').addClass('active');
			}else{
				this.currentTurn = 2;
				$('.turn').removeClass('active');
				$('.turn.player2').addClass('active');
			}
		}else{
			//change turn
			if(this.currentTurn === 1){
				this.currentTurn = 2;
				$('.turn').removeClass('active');
				$('.turn.player2').addClass('active');
			}else if(this.currentTurn === 2){
				this.currentTurn = 1;
				$('.turn').removeClass('active');
				$('.turn.player1').addClass('active');
			}
			
		}
	}
}


//function used to place a letter
Board.prototype.placeLetter = function(place,boardPosition){
	if(! this.isGameOver()){
		if(this.currentTurn === 1){
			if(this.board[boardPosition] === 0){
				this.board[boardPosition] = this.player1.score;
				$(place).html(this.player1.letterSVG);
				this.changeTurn();
				
			}
		}else if(this.currentTurn === 2){
			if(this.board[boardPosition] === 0){
				this.board[boardPosition] = this.player2.score;
				$(place).html(this.player2.letterSVG);
				this.changeTurn();
			}
		}
	}
}


Board.prototype.isWinner = function(){
	var board = this.board;
	var winner = '';
	//arrays for possible victory conditions
	var conditionHorizontal = [(board[0] + board[1] + board[2]), (board[3] + board[4] + board[5]), (board[6] + board[7] + board[8])];
	var conditionVertical = [(board[0] + board[3] + board[6]), (board[1] + board[4] + board[7]), (board[2] + board[5] + board[8])];
	var conditionDiagonal = [(board[0] + board[4] + board[8]),(board[2] + board[4] + board[6])];
	var victoryConditions = [conditionHorizontal,conditionVertical,conditionDiagonal];
	
	//run through vicotory conditions and determine if a there is a winner
	for(var x in victoryConditions){
		if(winner){
			break;
		}
		for(var y in victoryConditions[x]){
			if(victoryConditions[x][y] === 300){
				winner = 'player1';
				break;
			}else if(victoryConditions[x][y] === -300){
				winner = 'player2';
				break;
			}
		}
	}
	
	return winner;
}

//function that resets the game
Board.prototype.resetGame = function(){
	for(var x in this.board){
		this.board[x] = 0;
	}
	$('#'+this.boardId+' .square').children().remove();
	this.currentTurn = '';
	this.changeTurn();
}

//gameTime refers to wheather at start or end of the game
 Board.prototype.splash = function(gameTime){
	
	//display splash screen depending on if beginning or end of the game
	if(gameTime === 'start'){
		var splash = $('<div></div>',{
			'class' : 'splash'
		}).prependTo('body');
		var container = $('<div></div>',{
			'class' : 'container'
		}).appendTo(splash);
		var logo = $('<div></div>',{
			'class' : 'logo'
		}).appendTo(container);
		logo.html('<p class="logotxt">Tic<br>Tac<br>Toe</p>');
		
		var btn =  $('<button></button>',{
			'class': 'splash-button',
			'text' : 'Start Game'
		}).appendTo(container);
	}
	if(gameTime === 'end'){
		if(this.isWinner() === 'player1'){
			var splash = $('<div></div>',{
				'class' : 'splash p1'
			}).prependTo('body');
			var container = $('<div></div>',{
				'class' : 'container'
			}).appendTo(splash);
			var logo = $('<div></div>',{
				'class' : 'logo'
			}).appendTo(container);
			logo.html('<p class="logotxt">Tic<br>Tac<br>Toe</p>');
			
			var winnerDeclaration = $('<div></div>',{
				'class' : 'winner-declaration'
			}).appendTo(container);
			var svg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="43.493px" height="38.956px" viewBox="0 0 43.493 38.956" enable-background="new 0 0 43.493 38.956" xml:space="preserve"><g><path d="M15.554,0l6.264,10.945L28.586,0h14.041L30.315,19.01l13.178,19.946H28.731l-6.913-11.881l-7.705,11.881H0L13.25,19.01 L0.864,0H15.554z"/></g></svg>';
			winnerDeclaration.html(svg);
			
			var winner = $('<p></p>',{
				'text' : 'Winner'
			}).appendTo(winnerDeclaration);
			
			var btn =  $('<button></button>',{
				'class': 'splash-button',
				'text' : 'New Game'
			}).appendTo(container);
			
		}else if(this.isWinner() === 'player2'){
			var splash = $('<div></div>',{
				'class' : 'splash p2'
			}).prependTo('body');
			var container = $('<div></div>',{
				'class' : 'container'
			}).appendTo(splash);
			var logo = $('<div></div>',{
				'class' : 'logo'
			}).appendTo(container);
			logo.html('<p class="logotxt">Tic<br>Tac<br>Toe</p>');
			
			var winnerDeclaration = $('<div></div>',{
				'class' : 'winner-declaration'
			}).appendTo(container);
			var svg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="42.556px" height="39.819px" viewBox="0 0 42.556 39.819" enable-background="new 0 0 42.556 39.819" xml:space="preserve"><g><path d="M42.556,19.874c0,12.025-8.497,19.946-21.313,19.946C8.425,39.819,0,31.898,0,19.874C0,7.92,8.425,0,21.242,0 C34.059,0,42.556,7.92,42.556,19.874z M12.889,20.089c0,5.761,3.384,9.649,8.353,9.649c5.04,0,8.425-3.888,8.425-9.649 c0-5.833-3.385-9.721-8.425-9.721C16.273,10.369,12.889,14.257,12.889,20.089z"/></g></svg>';
			winnerDeclaration.html(svg);
			
			var winner = $('<p></p>',{
				'text' : 'Winner'
			}).appendTo(winnerDeclaration);
			
			var btn =  $('<button></button>',{
				'class': 'splash-button',
				'text' : 'New Game'
			}).appendTo(container);
		}else{
			var splash = $('<div></div>',{
				'class' : 'splash'
			}).prependTo('body');
			var container = $('<div></div>',{
				'class' : 'container'
			}).appendTo(splash);
			var logo = $('<div></div>',{
				'class' : 'logo'
			}).appendTo(container);
			
			logo.html('<p class="logotxt">Tic<br>Tac<br>Toe</p>');
			var winnerDeclaration = $('<div></div>',{
				'class' : 'winner-declaration'
			}).appendTo(container);
			
			var winner = $('<p></p>',{
				'text' : 'Draw'
			}).appendTo(winnerDeclaration);
			
			var btn =  $('<button></button>',{
				'class': 'splash-button',
				'text' : 'New Game'
			}).appendTo(container);
		}
	}
	
	//add a click function to the button to allow game to start or restart
	var _this = this;
	btn.on('click',function(){
		$('.board').remove();
		$('.splash').remove();
		_this.resetGame();
		var gameBoard = _this.createBoard();
		$('.content').append(gameBoard);
		resizeBoard();
	});
 }



var game = new Board('gameBoard');
var gameBoard = game.init();
