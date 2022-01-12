export function getInstructionsContent() {
    const instructions = `<h2>Board</h2>
          <p>
            There are 2 rows of cavities and 2 containers. Each player controls
            the cavities in its side and the container to its right.
          </p>
          <h2>Start</h2>
          <p>
            In the begining of the game the containers are empty and each cavity
            has the same number of seeds.
          </p>
          <h2>Game</h2>
          <p>
            Each player will, alternately, take the seeds in one of its cavities
            and sew one in each of the next cavities and in its container
            counterclockwisely. If the last seed is placed in the container, the
            current player has the next turn. If the last seed falls into a
            previously empty cavity controlled by the player, that seed and the
            seeds in the opposite cavity are placed in its container.
          </p>
          <h2>Ending</h2>
          <p>
            The game ends when a player can't sew due to lack of seeds. The
            other player places the seeds in its cavities in its container. Wins
            the player with more seeds in.
          </p>`;
    return instructions;
}
