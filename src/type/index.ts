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
     * 游戏模式
     */
    gameMode: GameMode;
    /**
     * 先手
     */
    firstPlayer: FirstPlayer;
    /**
     * 初始化棋盘
     */
    checkerboard: GameChessman[][];
    /**
     * 胜利者展示信息
     */
    win: {
        [key: string]: string;
    };
    /**
     * 棋子展示信息
     */
    chessmanStyle: {
        [key: string]: {
            name: string;
            chessmanClass: string;
        };
    };
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

// 游戏模式枚举
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

// 棋子枚举
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
    chessState: GameChessman[][];
    player: GameChessman;
    result: GameChessman | 'none' | '';
}

export type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;
