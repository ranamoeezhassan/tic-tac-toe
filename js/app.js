import View from "./view.js";
import Store from "./store.js";

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },

  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

function init() {
  const view = new View();
  const store = new Store('live-t3-key',players);

  function initView(){
    view.closeAll();
    view.clearMoves();
    view.setTurnIndicator(store.game.currentPlayer);
    view.updateScoreBoard(
      store.stats.playerWithStats[0].wins,
      store.stats.playerWithStats[1].wins,
      store.stats.ties
    );
    view.initializeMoves(store.game.moves);

  }
  initView();

  window.addEventListener("storage", () => {
    initView();
  })

  view.bindGameResetEvent((event) => {
    store.reset();
    initView();
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
    initView();
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );
    if (existingMove) {
      return;
    }

    //Place icon of current player in game
    view.handlePlayerMove(square, store.game.currentPlayer);

    //Advance to the next state by pushing the move in moves array
    store.playerMove(+square.id);

    if (store.game.status.isComplete) {
      view.openModal(
        store.game.status.winner
          ? `${store.game.status.winner.name} wins!`
          : "Tie!"
      );
    }

    // Set the next player indicator
    view.setTurnIndicator(store.game.currentPlayer);
  });
}
window.addEventListener("load", init);
