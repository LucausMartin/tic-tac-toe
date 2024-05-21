import { GameChessman, GameConfig } from '../type';

interface DirectionType {
    directionArr: [number, number][];
    count: number;
}

/**
 *
 * @description 连子棋判断胜利方法
 * @param location 新棋子坐标
 * @param winLength 胜利条件（连子个数）
 * @param checkerboardArr 棋盘状态
 * @returns 胜利方或者平局（true代表平局）
 */
export const judge = (location: [number, number], winLength: number, checkerboardArr: GameChessman[][]): GameChessman | null => {
    let winner = null;
    const directionArr: DirectionType[] = [
        {
            directionArr: [[1, 0], [-1, 0]],
            count: 0,
        },
        {
            directionArr: [[0, 1], [0, -1]],
            count: 0,
        },
        {
            directionArr: [[1, 1], [-1, -1]],
            count: 0,
        },
        {
            directionArr: [[1, -1], [-1, 1]],
            count: 0,
        },
    ];

    // 获取最大连子个数
    directionArr.forEach((item) => {
        getmaxWinLength(item, checkerboardArr, location, winLength);
    });

    // 遍历 directionArr 查看是否胜利
    directionArr.forEach((item) => {
        if (item.count >= winLength - 1) {
            winner = checkerboardArr[location[0]][location[1]] === GameChessman.X ? GameChessman.X : GameChessman.O;
        }
    });
    return winner;
};

/**
 *
 * @description 获取最大连子个数
 * @param direction 寻找方向
 * @param checkerboardArr 棋盘状态
 * @param location 新棋子坐标
 * @param winLength 胜利条件（连子个数）
 * @returns 最大连子个数
 */
const getmaxWinLength = (direction: DirectionType, checkerboardArr: GameChessman[][], location: [number, number], winLength: number): void => {
    const [row, col] = location;
    direction.directionArr.forEach((item) => {
        let flag = 0;
        let rowTemp = row + item[0];
        let colTemp = col + item[1];
        while (flag < winLength - 1) {
            if (rowTemp < 0 || rowTemp >= checkerboardArr.length || colTemp < 0 || colTemp >= checkerboardArr[0].length) {
                break;
            }
            if (checkerboardArr[rowTemp][colTemp] === checkerboardArr[row][col]) {
                direction.count++;
            }
            rowTemp += item[0];
            colTemp += item[1];
            flag++;
        }
    });
};

/**
 * @description 评分函数（始终相对 X 评分）
 * @returns 0 没到结束状态 1 O 胜利 2 平局 3 X 胜利
 */
const score = (checkerboardArr: GameChessman[][], winLength: number, location: [number, number]) => {
    if (judge(location, winLength, checkerboardArr) === null) {
        if (checkerboardArr.every((row) => row.every((col) => col !== GameChessman.Empty))) {
            return 2;
        }
        return 0;
    }
    if (judge(location, winLength, checkerboardArr) === GameChessman.X) {
        return 3;
    }
    return 1;
};

/**
 * @description 找到所有空位置
 */
const findAllEmptyLocation = (checkerboardArr: GameChessman[][]): [number, number][] => {
    const emptyLocation: [number, number][] = [];
    checkerboardArr.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (col === GameChessman.Empty) {
                emptyLocation.push([rowIndex, colIndex]);
            }
        });
    });
    return emptyLocation;
};

interface SuccessConfig {
    winLength: number;
    size: number;
    location: [number, number];
    checkerboardArr: GameChessman[][];
}
/**
 *
 * @description 极大极小值算法
 * @param successConfig 游戏胜利配置
 * @param max 是否是极大值
 * @param chessman 当前落子的棋子
 * @returns 评分
 */
const minimax = (successConfig: SuccessConfig, max: boolean, chessman: GameChessman, alpha: number, beta: number): number => {
    const { checkerboardArr, location, size, winLength } = successConfig;
    const newCheckerboard = checkerboardArr.map((row) => row.map((col) => col));
    const result = score(newCheckerboard, winLength, location);
    if (result !== 0) {
        return result;
    }
    let bestScore = max ? -Infinity : +Infinity;
    for (let row = 0; row < newCheckerboard.length; row++) {
        for (let col = 0; col < newCheckerboard[row].length; col++) {
            if (newCheckerboard[row][col] === GameChessman.Empty) {
                newCheckerboard[row][col] = chessman;
                const newSuccessConfig: SuccessConfig = {
                    winLength,
                    size,
                    location: [row, col],
                    checkerboardArr: newCheckerboard,
                };
                const score = minimax(newSuccessConfig, !max, chessman === GameChessman.X ? GameChessman.O : GameChessman.X, alpha, beta);
                newCheckerboard[row][col] = GameChessman.Empty;
                if (max) {
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, bestScore);
                    if (beta <= alpha) {
                        break;
                    }
                } else {
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, bestScore);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
    }
    return bestScore;
};

/**
 *
 * @param checkerboardArr 当前棋盘的状态
 * @param chessman 当前落子的棋子
 * @param config 游戏配置
 * @returns 最佳落子位置 （[-1, -1] 表示没有位置了）
 */
export const findBestLocation = (checkerboardArr: GameChessman[][], chessman: GameChessman, config: GameConfig): [number, number] => {
    const { size, winLength } = config;
    // 深拷贝棋盘状态
    const newCheckerboard = checkerboardArr.map((row) => row.map((col) => col));
    // 判断棋子是不是 X 决定是从 min 开始还是 max 开始
    let bestScore = chessman === GameChessman.X ? -Infinity : +Infinity;
    let bestLocation: [number, number] = [-1, -1];
    // 找到所有空位置
    const emptyLocation = findAllEmptyLocation(newCheckerboard);
    // 遍历所有空位置
    emptyLocation.forEach((location) => {
        newCheckerboard[location[0]][location[1]] = chessman;
        const successConfig: SuccessConfig = {
            winLength,
            size,
            location,
            checkerboardArr: newCheckerboard,
        };
        const score = minimax(successConfig, chessman === GameChessman.X, chessman === GameChessman.X ? GameChessman.O : GameChessman.X, -Infinity, +Infinity);
        newCheckerboard[location[0]][location[1]] = GameChessman.Empty;
        if (chessman === GameChessman.X) {
            if (score > bestScore) {
                bestScore = score;
                bestLocation = location;
            }
        } else {
            if (score < bestScore) {
                bestScore = score;
                bestLocation = location;
            }
        }
    });
    return bestLocation;
    // for (let row = 0; row < newCheckerboard.length; row++) {
    //     for (let col = 0; col < newCheckerboard[row].length; col++) {
    //         if (newCheckerboard[row][col] === GameChessman.Empty) {
    //             newCheckerboard[row][col] = chessman;
    //             // 用于判断胜利的配置
    //             const successConfig: SuccessConfig = {
    //                 winLength,
    //                 size,
    //                 location: [row, col],
    //                 checkerboardArr: newCheckerboard,
    //             };
    //             const score = minimax(successConfig, !(chessman === GameChessman.X), chessman === GameChessman.X ? GameChessman.O : GameChessman.X, -Infinity, +Infinity);
    //             newCheckerboard[row][col] = GameChessman.Empty;
    //             if (chessman === GameChessman.X) {
    //                 if (score > bestScore) {
    //                     bestScore = score;
    //                     bestLocation = [row, col];
    //                 }
    //             } else {
    //                 if (score < bestScore) {
    //                     bestScore = score;
    //                     bestLocation = [row, col];
    //                 }
    //             }
    //         }
    //     }
    // }
    // return bestLocation;
};
