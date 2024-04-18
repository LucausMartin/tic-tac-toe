import { FC } from 'react';
import { AllGameChessmanType, GameName, GameChessman } from '../../type';
import './index.css';

interface PieceProps {
    chessman: AllGameChessmanType;
    gameType: GameName;
    onClick: () => void;
}

/**
 *
 * @param chessman 棋子
 * @param gameType 游戏类型
 * @param onClick 点击事件
 * @description 棋子组件
 */
const Piece: FC<PieceProps> = ({ chessman, gameType, onClick }) => {
    console.warn('Piece渲染');
    return (
        gameType === GameName.TICTACTOE
            ? <div className='piece-container' onClick={onClick}>
                {chessman}
            </div>
            : <div className='piece-container' onClick={onClick}>
                {
                    chessman === GameChessman.Empty
                        ? null
                        : <div className={chessman === GameChessman.X ? 'piece-black' : 'piece-white'}></div>
                }
            </div>
    );
};

export { Piece };
