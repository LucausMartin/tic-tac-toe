import { AllGameChessmanType, GameChessman } from '../type';

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
export const judge = (location: [number, number], winLength: number, checkerboardArr: AllGameChessmanType[][]): GameChessman | null => {
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
const getmaxWinLength = (direction: DirectionType, checkerboardArr: AllGameChessmanType[][], location: [number, number], winLength: number): void => {
    const [row, col] = location;
    direction.directionArr.forEach((item) => {
        let flag = 0;
        let rowTemp = row + item[0];
        let colTemp = col + item[1];
        while (flag < winLength - 1) {
            // console.log('location', rowTemp, colTemp);
            if (rowTemp < 0 || rowTemp >= checkerboardArr.length || colTemp < 0 || colTemp >= checkerboardArr[0].length) {
                // console.log('超出边界');
                break;
            }
            if (checkerboardArr[rowTemp][colTemp] === checkerboardArr[row][col]) {
                // console.log('相同', rowTemp, colTemp);
                direction.count++;
            }
            rowTemp += item[0];
            colTemp += item[1];
            flag++;
        }
    });
};
