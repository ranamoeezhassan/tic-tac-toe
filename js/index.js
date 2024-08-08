const App = {
  $: {
    menu: document.querySelector('[data-id="menu"]'),
    menuItems: document.querySelector("[data-id='menu-items']"),
    resetBtn: document.querySelector("[data-id='reset-btn']"),
    newRoundBtn: document.querySelector("[data-id='new-round-btn']"),
    squares: document.querySelectorAll("[data-id='square']"),
  },

  state: {
    moves: [],
  },

  init: () => {
    // Done
    App.registerEventListener();
  },

  //TODO: Add functionality to the game

  registerEventListener: () => {
    App.$.menu.addEventListener("click", () => {
      App.$.menuItems.classList.toggle("hidden");
    });

    App.$.resetBtn.addEventListener("click", () => {
      console.log("Reset the game");
    });

    App.$.newRoundBtn.addEventListener("click", () => {
      console.log("New round");
    });

    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        // Want to dynamically add the tag
        // <i class="fa-solid fa-x yellow"></i> or <i class="fa-solid fa-o turquoise"></i>

        // Important lesson: Big difference between event.target and event.currentTarget
        // Just realized that square already refers to the element we want
        // const squareNode = event.currentTarget;

        if (square.hasChildNodes()) {
          return;
        }
        // var currentPlayer = App.state.currentPlayer;
        const lastMove = App.state.moves.at(-1);
        console.log(App.state.moves);
        const getOppositePlayer = (id) => (id === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerID);

        const child = document.createElement("i");
        // If player 1, put yellow x marker and change current player
        if (currentPlayer === 1) {
          child.classList.add("fa-solid", "fa-x", "yellow");
        } else {
          child.classList.add("fa-solid", "fa-o", "turquoise");
        }

        App.state.moves.push({
          squareId: +square.id,
          playerId: +currentPlayer,
        });

        square.appendChild(child);

        // Check if there is a winner or tie
        const winningPatterns = [
          [1, 2, 3],
          [1, 5, 9],
          [1, 4, 7],
          [2, 5, 8],
          [3, 5, 7],
          [3, 6, 9],
          [14, 5, 6],
          [17, 8, 9],
        ];
      });
    });
  },
};

window.addEventListener("load", App.init());
