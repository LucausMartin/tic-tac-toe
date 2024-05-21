import { GameConfig, GameName, GameMode, FirstPlayer, GameChessman } from '../type';

/**
 * @description 生成棋盘
 * @param size 棋盘大小
 * @returns 棋盘
 */
const generateChessboard = (size: number) => {
    const newCheckerboard = new Array(size).fill(null)
        .map(() => new Array(size).fill(GameChessman.Empty));
    return newCheckerboard;
};

/**
 * 井字棋配置
 */
export const TICTACTOE_CONFIG: GameConfig = {
    name: GameName.TICTACTOE,
    size: 3,
    winLength: 3,
    gameMode: GameMode.NONE,
    firstPlayer: FirstPlayer.NONE,
    checkerboard: generateChessboard(3),
    win: {
        [GameChessman.X]: 'X',
        [GameChessman.O]: 'O',
        ['none']: 'No one',
    },
    chessmanStyle: {
        [GameChessman.X]: {
            name: 'X',
            chessmanClass: 'piece-x',
        },
        [GameChessman.O]: {
            name: 'O',
            chessmanClass: 'piece-o',
        },
        [GameChessman.Empty]: {
            name: '',
            chessmanClass: '',
        },
    },
};

/**
 * 五子棋配置
*/
export const GOMOKU_CONFIG: GameConfig = {
    name: GameName.GOMOKU,
    size: 15,
    winLength: 5,
    gameMode: GameMode.PVP,
    firstPlayer: FirstPlayer.NONE,
    checkerboard: generateChessboard(15),
    win: {
        [GameChessman.X]: 'Black',
        [GameChessman.O]: 'White',
        ['none']: 'No one',
    },
    chessmanStyle: {
        [GameChessman.X]: {
            name: 'X',
            chessmanClass: 'piece-black',
        },
        [GameChessman.O]: {
            name: 'O',
            chessmanClass: 'piece-white',
        },
        [GameChessman.Empty]: {
            name: '',
            chessmanClass: '',
        },
    },
};

export const GAME_CONFIG = {
    [GameName.TICTACTOE]: TICTACTOE_CONFIG,
    [GameName.GOMOKU]: GOMOKU_CONFIG,
};
