export interface GameConfig {
    /**
     * 棋盘名称
     */
    name: GameName;
    /**
     * 棋盘用于展示大小
     */
    size: number;
    /**
     * 赢棋所需长度
     */
    winLength: number;
    /**
     * 棋子类型
     */
    chessmanType: ChessmanType;
}


export enum ChessmanType {
    /**
     * 井字棋
     */
    XO = 'XO',
    /**
     * 五子棋
     */
    BW = 'blackWhite',
}

export type AllGameChessmanType = GameChessman.X | GameChessman.O | GameChessman.Empty;

export enum GameChessman {
    X = 'X',
    O = 'O',
    Empty = '',
}

export enum GameName {
    /**
     * 井字棋
     */
    TICTACTOE = '井字棋',
    /**
     * 五子棋
     */
    GOMOKU = '五子棋',

}

export type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;