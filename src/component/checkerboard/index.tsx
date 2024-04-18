import { FC, useState, useEffect } from 'react';
import { AllGameChessmanType, GameName, GameChessman, ReactSetState } from '../../type';
import { Piece } from '../piece';
import { judge } from '../../tool';
import './index.css';

interface RecordType {
    chessState: AllGameChessmanType[][];
    player: GameChessman;
}

interface CheckerboardProps {
    size: number;
    winLength: number;
    gameType: GameName;
}
/**
 *
 * @param size 棋盘大小
 * @param winLength 胜利条件（连子个数）
 * @param gameType 游戏类型
 * @description 棋盘组件
 */
const Checkerboard: FC<CheckerboardProps> = ({ size, winLength, gameType }) => {
    console.warn('Checkerboard渲染', size, winLength, gameType);
    // 棋盘展示二维数组
    const [checkerboardShowArr, setCheckerboardShowArr] = useState<[number, number] | null>([-1, -1]);
    // 实际棋盘二维数组
    const [checkerboard, setCheckerboard] = useState<AllGameChessmanType[][] | null>(null);
    // 当前落子玩家
    const [player, setPlayer] = useState<AllGameChessmanType>(GameChessman.X);
    // 落子及胜者记录
    const [record, setRecord] = useState<RecordType[] | null>(null);
    // 胜者
    const [winner, setWinner] = useState<GameChessman>(GameChessman.Empty);
    // 棋盘状态所处第几条记录
    const [recordIndex, setRecordIndex] = useState<number>(0);
    // 是否平局
    const [noOneWin, setNoOneWin] = useState<boolean>(false);

    useEffect(() => {
        // 初始化棋盘
        const checkerboardSizeTemp = size + ((winLength - 1) * 2);
        const checkerboardShowArrTemp: [number, number] = [winLength - 1, size + winLength - 2];
        setCheckerboardShowArr(checkerboardShowArrTemp);

        const newCheckerboard = new Array(checkerboardSizeTemp);
        for (let item = 0; item < checkerboardSizeTemp; item++) {
            newCheckerboard[item] = new Array(checkerboardSizeTemp).fill(GameChessman.Empty);
        }
        setCheckerboard(newCheckerboard);
        setRecord([{
            chessState: newCheckerboard,
            player: GameChessman.O,
        }]);
    }, [size, winLength, gameType]);

    useEffect(() => {
        // 判断棋盘状态所处第几条记录
        let indexTemp = 0;
        if (record) {
            record.forEach((item, index) => {
                if (item.chessState === checkerboard) {
                    setRecordIndex(index);
                    indexTemp = index;
                }
            });
        }
        if (record && indexTemp !== record.length - 1) {
            setWinner(GameChessman.Empty);
        }
    });

    /**
     *
     * @description 落子一系列操作函数
     * @param location 落子坐标
     * @returns 落子函数
     */
    const dropPiece = (location: [number, number]) => {
        return () => {
            if (winner !== GameChessman.Empty) {
                return;
            }
            if (!checkerboard) {
                return;
            }
            // 已经落子
            if (checkerboard[location[0]][location[1]] !== GameChessman.Empty) {
                return;
            }
            // 添加新子
            const newCheckerboard = checkerboard.map((row, rowIndex) => (
                row.map((col, colIndex) => (
                    rowIndex === location[0] && colIndex === location[1] ? player : col
                ))
            ));
            setCheckerboard(newCheckerboard);
            // 切换玩家
            setPlayer(player === GameChessman.X ? GameChessman.O : GameChessman.X);
            // 根据棋盘状态所处第几条记录， 添加棋盘状态
            setRecord(record && record.slice(0, recordIndex + 1).concat([{
                chessState: newCheckerboard,
                player,
            }]));
            // 判断胜利
            const winnerTemp = judge(location, winLength, newCheckerboard);
            if (winnerTemp) {
                if (winnerTemp === true) {
                    setNoOneWin(true);
                } else {
                    setWinner(winnerTemp);
                }
            }
        };
    };

    return (
        <div className='checkerboard-container'>
            <div className='checkerboard-chess-container'>
                <div className='checkerboard-chess-no-one-win'>{noOneWin && '平局'}</div>
                <div className='checkerboard-chess-info'>
                    <span>
                        Winner: {winner}
                    </span>
                    <span>
                        {player} Please
                    </span>
                </div>
                {
                    checkerboard && checkerboard.map((row, rowIndex) => (
                        checkerboardShowArr && rowIndex >= checkerboardShowArr[0] && rowIndex <= checkerboardShowArr[1] &&
                        <div key={rowIndex} className='checkerboard-row'>
                            {
                                row.map((__, colIndex) => (
                                    colIndex >= checkerboardShowArr[0] && colIndex <= checkerboardShowArr[1] &&
                                    <div key={colIndex} className='checkerboard-col'>
                                        <Piece
                                            gameType={gameType}
                                            chessman={checkerboard[rowIndex][colIndex]}
                                            onClick={dropPiece([rowIndex, colIndex])}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
            <Record
                record={record}
                setCheckerboard={setCheckerboard}
                setPlayer={setPlayer}
            />
        </div>
    );
};


interface RecordProps {
    record: RecordType[] | null;
    setCheckerboard: ReactSetState<AllGameChessmanType[][] | null>;
    setPlayer: ReactSetState<AllGameChessmanType>;
}
/**
 *
 * @param record 落子及胜者记录
 * @param setCheckerboard 设置棋盘状态
 * @param setPlayer 设置当前落子玩家
 * @description 落子及胜者记录展示组件
 */
const Record: FC<RecordProps> = ({ record, setCheckerboard, setPlayer }) => {
    console.warn('Record渲染');
    /**
     *
     * @param step 需要移动到的步数
     * @returns 返回移动到指定步数的函数
     */
    const moveToStep = (step: number) => {
        return () => {
            if (record && record[step].chessState) {
                record[step].chessState && setCheckerboard(record[step].chessState);
                setPlayer(record[step].player === GameChessman.X ? GameChessman.O : GameChessman.X);
            }
        };
    };
    return (
        <div className='record-container'>
            {
                record && record.map((__, index) => (
                    <div key={index}>
                        <button className='record-button' onClick={moveToStep(index)}>move to {index}</button>
                    </div>
                ))
            }
        </div>
    );
};

export { Checkerboard };
