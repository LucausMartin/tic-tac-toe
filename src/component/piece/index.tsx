import { FC, memo } from 'react';
import { AllGameChessmanType, GameName, GameChessman } from '../../type';
import { useSelector } from 'react-redux';
import { selectConfig } from '../../store/slices/gameConfigSlice';

import './index.css';

interface PieceProps {
    chessman: AllGameChessmanType;
    rowIndex: number;
    colIndex: number;
    onClick: (location: [number, number]) => void;
}

/**
 *
 * @param chessman 棋子
 * @param rowIndex 棋子所在行
 * @param colIndex 棋子所在列
 * @param onClick 点击事件
 * @description 棋子组件
 */
const Piece: FC<PieceProps> = memo(({ chessman, rowIndex, colIndex, onClick }) => {
    const { name } = useSelector(selectConfig);
    return (
        <div className='checkerboard-col'>
            {
                name === GameName.TICTACTOE
                    ? <div className='piece-container' onClick={() => onClick([rowIndex, colIndex])}>
                        {chessman}
                    </div>
                    : <div className='piece-container' onClick={() => onClick([rowIndex, colIndex])}>
                        {
                            chessman === GameChessman.Empty
                                ? null
                                : <div className={chessman === GameChessman.X ? 'piece-black' : 'piece-white'}></div>
                        }
                    </div>

            }
        </div>
    );
});

export { Piece };
