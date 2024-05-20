import { GameConfig, ChessmanType, GameName, GameMode, FirstPlayer } from '../type';

/**
 * 井字棋配置
 */
export const TICTACTOE_CONFIG: GameConfig = {
    name: GameName.TICTACTOE,
    size: 3,
    winLength: 3,
    chessmanType: ChessmanType.XO,
    gameMode: GameMode.NONE,
    firstPlayer: FirstPlayer.NONE,
};

/**
 * 五子棋配置
*/
export const GOMOKU_CONFIG: GameConfig = {
    name: GameName.GOMOKU,
    size: 15,
    winLength: 5,
    chessmanType: ChessmanType.BW,
    gameMode: GameMode.PVP,
    firstPlayer: FirstPlayer.PLAYER,
};
