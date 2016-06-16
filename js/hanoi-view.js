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
