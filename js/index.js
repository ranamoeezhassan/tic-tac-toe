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

  getGameStatus: (moves) => {
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
      status: (p1Moves.length + p2Moves.length === 9) || (winner !== null) ? "complete" : "in-progress",
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

        const child = document.createElement("i");

        // If player 1, put yellow x marker and change current player
        if (currentPlayer === 1) {
          child.classList.add("fa-solid", "fa-x", "yellow");
        } else {
          child.classList.add("fa-solid", "fa-o", "turquoise");
        }

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });
        square.appendChild(child);


        const game = App.getGameStatus(App.state.moves);

        if (game.status === "complete"){
          const modalContainer = document.querySelector(".modal");
          const pElement = modalContainer.querySelector("p");

          if (game.winner === 1){
            pElement.innerHTML = "Player 1 Wins";
          } else if (game.winner === 2){
            pElement.innerHTML = "Player 2 Wins";
          } else {
            pElement.innerHTML = "It's a draw";
          }
          modalContainer.classList.toggle("hidden");
        }

      });
    });
  },
};

window.addEventListener("load", App.init);
