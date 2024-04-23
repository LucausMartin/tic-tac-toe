import { PureComponent } from 'react';
import { AllGameChessmanType, GameName, GameChessman } from '../../type';
import './index.css';

interface PieceProps {
    chessman: AllGameChessmanType;
    gameType: GameName;
    rowIndex: number;
    colIndex: number;
    onClick: (location: [number, number]) => void;
}

/**
 *
 * @param chessman 棋子
 * @param rowIndex 棋子所在行
 * @param colIndex 棋子所在列
 * @param gameType 游戏类型
 * @param onClick 点击事件
 * @description 棋子组件
 */
class Piece extends PureComponent<PieceProps> {
    render () {
        console.warn('Piece render');
        const { chessman, gameType, rowIndex, colIndex, onClick } = this.props;
        return (
            <div className='checkerboard-col'>
                {
                    gameType === GameName.TICTACTOE
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
    }
}

export { Piece };
