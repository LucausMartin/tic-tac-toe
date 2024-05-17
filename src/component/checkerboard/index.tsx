import { FC, useState, useEffect, useCallback, memo } from 'react';
import { AllGameChessmanType, GameChessman, GameName } from '../../type';
import { Piece } from '../piece';
import { judge } from '../../tool';
import { useDispatch, useSelector } from 'react-redux';
import { addRecord, selectRecord, initialRecord } from '../../store/slices/recordSlice';
import { selectConfig } from '../../store/slices/gameConfigSlice';
import './index.css';

/**
 *
 * @param gameConfig 游戏配置
 * @description 棋盘组件
 */
const Checkerboard = () => {
    const { size, winLength, name } = useSelector(selectConfig);
    const dispatch = useDispatch();
    // 落子及胜者记录
    const record = useSelector(selectRecord);
    // 棋盘二维数组
    const [checkerboard, setCheckerboard] = useState<AllGameChessmanType[][] | null>(null);
    // 当前落子玩家
    const [player, setPlayer] = useState<AllGameChessmanType>(GameChessman.X);
    // 胜者
    const [winner, setWinner] = useState<GameChessman | 'none'>(GameChessman.Empty);
    // 棋盘状态所处第几条记录
    const [recordIndex, setRecordIndex] = useState<number>(0);
    // 新落子坐标
    const [newPieceLocation, setNewPieceLocation] = useState<[number, number] | null>(null);

    // 初始化棋盘
    useEffect(() => {
        const newCheckerboard = createTwoDimensionalArray(size);
        setCheckerboard(newCheckerboard);
        setPlayer(GameChessman.X);
        dispatch(initialRecord({ checkerboard: newCheckerboard }));
        setWinner(GameChessman.Empty);
        setRecordIndex(0);
    }, [size]);

    // 落子后的操作
    useEffect(() => {
        if (winner !== GameChessman.Empty) {
            return;
        }
        if (!checkerboard) {
            return;
        }
        if (!newPieceLocation) {
            return;
        }
        if (checkerboard[newPieceLocation[0]][newPieceLocation[1]] !== GameChessman.Empty) {
            return;
        }

        // 添加新子
        const newCheckerboard = checkerboard.map((row, rowIndex) => (
            row.map((col, colIndex) => (
                rowIndex === newPieceLocation[0] && colIndex === newPieceLocation[1] ? player : col
            ))
        ));
        setCheckerboard(newCheckerboard);

        // 切换玩家
        setPlayer(player === GameChessman.X ? GameChessman.O : GameChessman.X);

        // 判断胜利并记录胜利情况
        let result: GameChessman | 'draw' = GameChessman.Empty;
        const winnerTemp = judge(newPieceLocation, winLength, newCheckerboard);
        if (winnerTemp !== null) {
            setWinner(winnerTemp);
            result = winnerTemp;
        } else {
            // 平局判断
            if (record && record.length === size * size) {
                setWinner('none');
                result = 'draw';
            }
        }

        // 根据棋盘状态所处第几条记录在其之后添加棋盘状态
        dispatch(addRecord({
            recordIndex,
            chessState: {
                chessState: newCheckerboard,
                player: player === GameChessman.X ? GameChessman.O : GameChessman.X,
                result,
            },
        }));
        setRecordIndex(recordIndex + 1);
    }, [newPieceLocation]);

    // 点击记录后的操作
    useEffect(() => {
        if (!record) {
            return;
        }

        // 根据棋盘状态所处第几条记录设置棋盘状态
        if (record[recordIndex] && record[recordIndex].chessState) {
            setCheckerboard(record[recordIndex].chessState);
            setPlayer(record[recordIndex].player);
        }

        // 赋值胜者
        if (record && record[recordIndex].result === 'draw') {
            setWinner('none');
        } else {
            setWinner(record[recordIndex].result as GameChessman);
        }
    }, [recordIndex]);

    /**
     * @description 创建二维数组
     * @returns 二维数组
     */
    const createTwoDimensionalArray: (size: number) => AllGameChessmanType[][] = useCallback((size: number) => {
        return new Array(size).fill(null)
            .map(() => new Array(size).fill(GameChessman.Empty));
    }, [size]);

    /**
     *
     * @description 获取新落子的坐标
     * @param location 落子坐标
     */
    const dropPiece = useCallback((location: [number, number]) => {
        setNewPieceLocation(location);
    }, []);

    /**
     * @description 设置棋盘状态所处第几条记录
     * @param index 棋盘状态所处第几条记录
     */
    const updateRecordIndex = useCallback((index: number) => {
        setRecordIndex(index);
    }, []);

    return (
        <div className='checkerboard-container'>
            <div className='checkerboard-chess-container'>
                <div className='checkerboard-chess-info'>
                    {name !== GameName.GOMOKU && <span>
                        Winner: {winner}
                    </span>}
                    {name === GameName.GOMOKU && <span>
                        Winner: {
                            winner === GameChessman.X ? 'Black' : <>{winner === GameChessman.O ? 'White' : winner}</>
                        }
                    </span>}
                    <span>
                        {player} Please
                    </span>
                </div>
                {
                    checkerboard && Array(size).fill(null)
                        .map((__, rowIndex) => (
                            <div key={rowIndex} className='checkerboard-row'>
                                {
                                    Array(size).fill(null)
                                        .map((__, colIndex) => (
                                            <Piece
                                                key={colIndex}
                                                rowIndex={rowIndex}
                                                colIndex={colIndex}
                                                chessman={checkerboard.length === size ? checkerboard[rowIndex][colIndex] : GameChessman.Empty}
                                                onClick={dropPiece}
                                            />
                                        ))
                                }
                            </div>
                        ))
                }
            </div>
            {
                record &&
                <Record
                    setRecordIndex={updateRecordIndex}
                />
            }
        </div>
    );
};


interface RecordProps {
    setRecordIndex: (index: number) => void;
}
/**
 *
 * @param setRecordIndex 设置棋盘状态所处第几条记录
 * @description 落子及胜者记录展示组件
 */
const Record: FC<RecordProps> = memo(({ setRecordIndex }) => {
    // 落子及胜者记录
    const record = useSelector(selectRecord);
    return (
        <div className='record-container'>
            {
                record && record.map((__, index) => (
                    <div key={index}>
                        <button className='record-button' onClick={() => setRecordIndex(index)}>move to {index}</button>
                    </div>
                ))
            }
        </div>
    );
});

export { Checkerboard };
