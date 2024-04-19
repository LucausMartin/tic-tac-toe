import { AllGameChessmanType, GameChessman } from '../type';

/**
 *
 * @description 连子棋判断胜利方法
 * @param location 新棋子坐标
 * @param winLength 胜利条件（连子个数）
 * @param checkerboardArr 棋盘状态
 * @returns 胜利方
 */
export const judge = (location: [number, number], winLength: number, checkerboardArr: AllGameChessmanType[][]): GameChessman | null | true => {
    const [row, col] = location;
    // 定义四个方向
    const directionArr: [number, number][] = [[1, 0], [0, 1], [1, 1], [1, -1]];
    // 该方向可能胜利范围内最大的连子个数
    let maxWinLength = 0;
    // 判断是否平局
    let isFull = true;
    // 遍历棋盘
    for (let itemI = 0; itemI < checkerboardArr.length; itemI++) {
        for (let itemJ = 0; itemJ < checkerboardArr[itemI].length; itemJ++) {
            if (checkerboardArr[itemI][itemJ] === '') {
                isFull = false;
                break;
            }
        }
    }
    // 遍历四个方向
    for (const direction of directionArr) {
        // 获取该方向上的最大连子个数
        const directionMaxWinLength = getmaxWinLength(direction, checkerboardArr, location, winLength);
        if (directionMaxWinLength > maxWinLength) {
            maxWinLength = directionMaxWinLength;
        }
    }
    if (maxWinLength >= winLength) {
        return checkerboardArr[row][col] === GameChessman.X ? GameChessman.X : GameChessman.O;
    } else if (isFull) {
        return true;
    }
    return null;
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
const getmaxWinLength = (direction: [number, number], checkerboardArr: AllGameChessmanType[][], location: [number, number], winLength: number): number => {
    let count = 0;
    for (let item = -winLength + 1; item < winLength; item++) {
        const [row, col] = location;
        if (row + (item * direction[0]) < 0 || row + (item * direction[0]) >= checkerboardArr.length) {
            continue;
        }
        if (col + (item * direction[1]) < 0 || col + (item * direction[1]) >= checkerboardArr[row].length) {
            continue;
        }
        if (checkerboardArr[row + (item * direction[0])][col + (item * direction[1])] === checkerboardArr[row][col]) {
            count++;
        } else {
            continue;
        }
    }

    return count;
};
