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
    /**
     * 游戏模式
     */
    gameMode: GameMode;
    /**
     * 先手
     */
    firstPlayer: FirstPlayer;
}

// 先手枚举
export enum FirstPlayer {
    /**
     * 玩家1
     */
    AI = 'AI',
    /**
     * 玩家2
     */
    PLAYER = 'player',
    /**
     * 未选择
     */
    NONE = '',
}

export enum GameMode {
    /**
     * 人机对战
     */
    PVE = 'PVE',
    /**
     * 玩家对战
     */
    PVP = 'PVP',
    /**
     * 未选择
     */
    NONE = '',
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
    /**
     * Player1 棋子
     */
    X = 'X',
    /**
     * Player2 棋子
     */
    O = 'O',
    /**
     * 空白棋子
     */
    Empty = '',
}

export enum GameName {
    /**
     * 井字棋
     */
    TICTACTOE = 'tictactoe',
    /**
     * 五子棋
     */
    GOMOKU = 'gomoku',
}

export interface RecordType {
    chessState: AllGameChessmanType[][];
    player: GameChessman;
    result: GameChessman | 'none' | '';
}

export type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;
