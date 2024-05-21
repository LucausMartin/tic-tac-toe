import { PureComponent } from 'react';
import { GameChessman, GameConfig } from '../../type';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import './index.css';

interface PieceProps {
    chessman: GameChessman;
    config: GameConfig;
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
        const { chessman, rowIndex, colIndex, onClick } = this.props;
        const { chessmanStyle } = this.props.config;
        return (
            <div className='checkerboard-col'>
                {
                    <div className='piece-container' onClick={
                        () => {
                            onClick([rowIndex, colIndex]);
                        }
                    }>
                        <div className={chessmanStyle[chessman].chessmanClass}></div>
                    </div>
                }
            </div>
        );
    }
}

/**
 *
 * @param state Redux 集中管理的状态
 * @returns 返回游戏配置状态
 */
const mapStateToProps = (state: RootState) => ({ config: state.configer.config });

export const ConnectedPiece = connect(mapStateToProps)(Piece);
