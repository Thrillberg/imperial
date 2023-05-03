import Action from '../Domain/action';
import { Nation } from '../Domain/constants';
import GameBoard from '../Domain/gameBoard';
import Imperial from '../Domain/ImperialGameCoordinator';
import MachineLearning from './machineLearning';

const initialize = (game) => {
  game.tick(
    Action.initialize({
      players: [
        { id: 'player1', nation: Nation.AH },
        { id: 'player2', nation: Nation.IT },
      ],
      soloMode: false,
      variant: 'standard',
      baseGame: 'imperial',
    }),
  );
};

describe('machineLearning', () => {
  const newGame = () => {
    const board = new GameBoard({
      nodes: [
        { name: 'a', nation: Nation.AH },
        { name: 'b', nation: Nation.AH },
      ],
      edges: [],
    });

    const game = new Imperial(board);
    initialize(game);
    return game;
  };

  describe('stateArray', () => {
    test('converts game state to an array', () => {
      console.log('hi')
      const game = newGame();
      for (const [name, data] of game.nations) {
        game.nations.get(name).rondelPosition = 'factory'
      }
      const expected = [1, 1, 1, 1, 1, 1, 42];

      expect(MachineLearning.stateArray(game)).toEqual(expected);
    });
  });

  describe('playing games', () => {
    test('it generates a playedGame 2d array', async () => {
      let index = 0;
      while (index <= 100) {
        const game = new Imperial();
        initialize(game);
        const playedGame = await MachineLearning.play(game);
        MachineLearning.writeGame(playedGame);
        index += 1;
        console.log('Game number: ', index)
      }

      //expect(playedGame.length + 1).toEqual(game.log.length);
    }, 300000000);
  });
});