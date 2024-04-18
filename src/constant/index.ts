import { GameConfig, ChessmanType, GameName } from '../type';

/**
 * 井字棋配置
 */
export const TICTACTOECONFIG: GameConfig = {
    name: GameName.TICTACTOE,
    size: 3,
    winLength: 3,
    chessmanType: ChessmanType.XO,
};

/**
 * 五子棋配置
 */
export const GOMOKUCONFIG: GameConfig = {
    name: GameName.GOMOKU,
    size: 15,
    winLength: 5,
    chessmanType: ChessmanType.BW,
};
