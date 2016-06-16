/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const HanoiGame = __webpack_require__(1)
	const HanoiView = __webpack_require__(2)
	
	
	$( () => {
	  const rootEl = $('.hanoi');
	  const game = new HanoiGame();
	  new HanoiView(game, rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	function Game () {
	  this.towers = [[3, 2, 1], [], []];
	};
	
	Game.prototype.isValidMove = function(startTowerIdx, endTowerIdx) {
	    const startTower = this.towers[startTowerIdx];
	    const endTower = this.towers[endTowerIdx];
	
	    if (startTower.length === 0) {
	      return false;
	    } else if (endTower.length == 0) {
	      return true;
	    } else {
	      const topStartDisc = startTower[startTower.length - 1];
	      const topEndDisc = endTower[endTower.length - 1];
	      return topStartDisc < topEndDisc;
	    }
	};
	
	Game.prototype.isWon = function(){
	    // move all the discs to the last or second tower
	    return (this.towers[2].length == 3) || (this.towers[1].length == 3);
	};
	
	
	Game.prototype.move = function(startTowerIdx, endTowerIdx) {
	    if (this.isValidMove(startTowerIdx, endTowerIdx)) {
	      this.towers[endTowerIdx].push(this.towers[startTowerIdx].pop());
	      return true;
	    } else {
	      return false;
	    }
	};
	
	
	Game.prototype.print = function(){
	    console.log(JSON.stringify(this.towers));
	};
	
	
	Game.prototype.promptMove = function(reader, callback) {
	    this.print();
	    reader.question("Enter a starting tower: ", start => {
	      const startTowerIdx = parseInt(start);
	      reader.question("Enter an ending tower: ", end => {
	        const endTowerIdx = parseInt(end);
	        callback(startTowerIdx, endTowerIdx)
	      });
	    });
	};
	
	Game.prototype.run = function(reader, gameCompletionCallback) {
	    this.promptMove(reader, (startTowerIdx, endTowerIdx) => {
	      if (!this.move(startTowerIdx, endTowerIdx)) {
	        console.log("Invalid move!");
	      }
	
	      if (!this.isWon()) {
	        // Continue to play!
	        this.run(reader, gameCompletionCallback);
	      } else {
	        this.print();
	        console.log("You win!");
	        gameCompletionCallback();
	      }
	    });
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	function HanoiView(game, el){
	  this.game = game;
	  this.el = el;
	  this.renderTowers();
	}
	
	HanoiView.prototype.renderTowers = function (callback) {
	  if (callback) {
	    callback();
	  }
	
	  this.el.empty();
	  $stacks = this.createTowers();
	
	  this.el.append($stacks);
	  this.isOver();
	
	};
	
	HanoiView.prototype.isOver = function () {
	  if (this.game.isWon()) {
	    $(".tower, .tower-empty, .tower-selected").off("click touchstart")
	               .removeClass()
	               .addClass('tower-empty');
	    this.playAgain();
	  } else {
	    return;
	  }
	};
	
	HanoiView.prototype.createTowers = function () {
	  let $stacks = $("<div>").addClass("towers");
	  let towers = this.game.towers;
	  towers.forEach((tower, index) => {
	    $stack = $("<div>").attr("pos", index);
	
	    tower.forEach( (num) =>  {
	      $disk =  $("<div>").addClass(`size-${num}`);
	      $stack.append($disk);
	    })
	
	    $stack = this.setStackClass($stack)
	                 .on("click touchstart", (e) => { this.clickTower(e); });
	    $stacks.append($stack);
	  })
	  return $stacks;
	};
	
	
	HanoiView.prototype.setStackClass = function ($stack) {
	
	  if ($stack.children().length < 1) {
	    $stack.addClass("tower-empty");
	  } else {
	      $stack.addClass("tower");
	    }
	
	  return $stack;
	}
	
	HanoiView.prototype.clickTower = function (event) {
	  let $tower = $(event.currentTarget);
	  let $selected = $(".tower-selected")
	  if ( $selected.length < 1 ) {
	    $tower.removeClass("tower");
	    $tower.addClass("tower-selected");
	
	    let $emptyTowers = $(".tower-empty")
	    $emptyTowers.removeClass();
	    $emptyTowers.addClass("tower");
	  } else {
	      let startPos = parseInt($selected.attr("pos"));
	      let endPos = parseInt($tower.attr("pos"));
	      if (this.game.move(startPos, endPos)) {
	        this.renderTowers();
	      } else {
	        this.renderTowers(() => { alert("Not a valid move!")});
	      }
	
	  }
	
	};
	
	HanoiView.prototype.playAgain = function () {
	  let $win = $('<div>').addClass("modal")
	                       .append($('<p>').text('Congratulations, you have won!')
	                                       .addClass("modal-content"));
	  $(".hanoi").append($win);
	  let $playAgain = $('<input type="button" value="Play Again?"/>');
	  $playAgain.addClass("waves-effect").addClass("waves-light")
	            .on("click touchstart", function(){
	                document.location.reload(false);
	            })
	  $(".modal-content").append($("<div>").addClass("again-button")
	                             .append($playAgain));
	
	};
	
	
	
	
	module.exports = HanoiView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map