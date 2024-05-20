import { GameChessman } from '../type';

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
 *
 * @param checkerboardArr 棋盘状态
 * @param deep 深度
 * @param winLength 胜利条件（连子个数）
 * @returns 评分
 */
const minimax = (checkerboardArr: GameChessman[][], deep: number, winLength: number, location: [number, number], chessman: GameChessman, size: number): number => {
    // 深拷贝棋盘状态
    const newCheckerboard = checkerboardArr.map((row) => row.map((col) => col));
    // 判断胜者
    const winner = judge(location, winLength, newCheckerboard);
    if (winner !== null) {
        if (winner === chessman) {
            // console.log('X win', newCheckerboard);
            return 1;
        }
        return -1;
    }
    if (deep === size * size) {
        return 0;
    }

    if (deep % 2 === 0) {
        let bestScore = -Infinity;
        for (let row = 0; row < newCheckerboard.length; row++) {
            for (let col = 0; col < newCheckerboard[row].length; col++) {
                if (newCheckerboard[row][col] === GameChessman.Empty) {
                    newCheckerboard[row][col] = chessman;
                    const score = minimax(newCheckerboard, deep + 1, winLength, [row, col], chessman === GameChessman.X ? GameChessman.O : GameChessman.X, size);
                    newCheckerboard[row][col] = GameChessman.Empty;
                    if (score > bestScore) {
                        bestScore = score;
                    }
                }
            }
        }
        return bestScore;
    }
    let bestScore = +Infinity;
    for (let row = 0; row < newCheckerboard.length; row++) {
        for (let col = 0; col < newCheckerboard[row].length; col++) {
            if (newCheckerboard[row][col] === GameChessman.Empty) {
                newCheckerboard[row][col] = chessman;
                const score = minimax(newCheckerboard, deep + 1, winLength, [row, col], chessman === GameChessman.X ? GameChessman.O : GameChessman.X, size);
                newCheckerboard[row][col] = GameChessman.Empty;
                if (score < bestScore) {
                    bestScore = score;
                }
            }
        }
    }
    return bestScore;
};

/**
 *
 * @param checkerboardArr 当前棋盘的状态
 * @param player 当前玩家
 * @returns 最佳落子位置
 */
export const findBestLocation = (checkerboardArr: GameChessman[][], chessman: GameChessman, winLength: number, size: number): [number, number] => {
    // 深拷贝棋盘状态
    const newCheckerboard = checkerboardArr.map((row) => row.map((col) => col));
    // 遍历棋盘空位置落子
    let bestScore = -Infinity;
    let bestLocation: [number, number] = [-1, -1];
    const deep = 0;
    for (let row = 0; row < newCheckerboard.length; row++) {
        for (let col = 0; col < newCheckerboard[row].length; col++) {
            if (newCheckerboard[row][col] === GameChessman.Empty) {
                newCheckerboard[row][col] = chessman;
                const score = minimax(newCheckerboard, deep, winLength, [row, col], chessman === GameChessman.X ? GameChessman.O : GameChessman.X, size);
                newCheckerboard[row][col] = GameChessman.Empty;
                if (score > bestScore) {
                    bestScore = score;
                    bestLocation = [row, col];
                }
            }
        }
    }
    return bestLocation;
};
