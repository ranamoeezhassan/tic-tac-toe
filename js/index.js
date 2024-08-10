const App = {
  $: {
    menu: document.querySelector('[data-id="menu"]'),
    menuItems: document.querySelector("[data-id='menu-items']"),
    resetBtn: document.querySelector("[data-id='reset-btn']"),
    newRoundBtn: document.querySelector("[data-id='new-round-btn']"),
    squares: document.querySelectorAll("[data-id='square']"),
    modal: document.querySelector("[data-id='modal']"),
    modalText: document.querySelector("[data-id='modal-text']"),
    modalBtn: document.querySelector("[data-id='modal-btn']"),
    turn: document.querySelector("[data-id='turn']"),
    turnSymbol: document.querySelector("[data-id='turn-symbol']"),
    turnText: document.querySelector("[data-id='turn-text']"),
  },

  state: {
    moves: [],
  },

  getGameStatus: (moves) => {
    // Check if there is a winner or tie
    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    const p1 = moves.filter((move) => move.playerId === 1);
    const p2 = moves.filter((move) => move.playerId === 2);
    const p1Moves = p1.map((player) => player.squareId);
    const p2Moves = p2.map((player) => player.squareId);

    // Important lesson: Using a return in a for each loop only exits out of the current iteration, so have to use a standard for loop
    // I ended up changing my code and simplified it so it does not have to return in the loop
    let winner = null;
    winningPatterns.forEach((pattern) => {
      const p1Result = pattern.every((patternMove) =>
        p1Moves.includes(patternMove)
      );
      const p2Result = pattern.every((patternMove) =>
        p2Moves.includes(patternMove)
      );

      if (p1Result) winner = 1;
      if (p2Result) winner = 2;
    });

    return {
      status:
        p1Moves.length + p2Moves.length === 9 || winner !== null
          ? "complete"
          : "in-progress",
      winner,
    };
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

    App.$.modalBtn.addEventListener("click", () => {
      App.state.moves = [];
      App.$.squares.forEach((square) => {
        // Found a better to remove all children
        square.replaceChildren();
        // while (square.firstChild){
        //   square.firstChild.remove();
        // }
      });
      App.$.modal.classList.add("hidden");
    });

    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        // Want to dynamically add the tag
        // <i class="fa-solid fa-x yellow"></i> or <i class="fa-solid fa-o turquoise"></i>

        // Important lesson: Big difference between event.target and event.currentTarget
        // Just realized that square already refers to the element we want so dont need event target
        // const squareNode = event.currentTarget;

        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };

        if (hasMove(+square.id)) {
          return;
        }

        const lastMove = App.state.moves.at(-1);
        const getOppositePlayer = (id) => (id === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);

        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");

        // If player 1, put yellow x marker and change current player
        // <i data-id="turn-symbol" class="fa-solid fa-x turquoise" style="color: var(--yellow)"></i>
        // <p data-id="turn-text">Player 1, you're up!</p>
        if (currentPlayer === 1) {
          squareIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
        } else {
          squareIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-x", "yellow");
        }

        square.appendChild(squareIcon);
        App.$.turnText.textContent = `Player ${getOppositePlayer(currentPlayer)}, you're up!`;
        App.$.turn.classList.toggle("yellow");
        App.$.turn.classList.toggle("turquoise");
        App.$.turn.replaceChildren(turnIcon, App.$.turnText);

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });
      

        const game = App.getGameStatus(App.state.moves);

        if (game.status === "complete") {
          let message = "";
          if (game.winner) {
            message = `Player ${game.winner} wins!`;
          } else {
            message = "Tie";
          }
          App.$.modalText.textContent = message;
          App.$.modal.classList.remove("hidden");
        }
      });
    });
  },
};

window.addEventListener("load", App.init);
