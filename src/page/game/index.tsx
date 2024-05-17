import { FC } from 'react';
import { GOMOKU_CONFIG, TICTACTOE_CONFIG } from '../../constant';
import { Checkerboard } from '../../component';
import { useDispatch, useSelector } from 'react-redux';
import { changeToGomoku, changeToTicTacToe, selectConfig } from '../../store/slices/gameConfigSlice';
import './index.css';

/**
 *
 * @description 游戏根组件
 */
const Game: FC = () => {
    const dispatch = useDispatch();
    const { name } = useSelector(selectConfig);

    /**
     * @description 切换游戏配置
     */
    const changeGameConfig = () => {
        if (name === GOMOKU_CONFIG.name) {
            dispatch(changeToTicTacToe());
        } else {
            dispatch(changeToGomoku());
        }
    };

    return (
        <div className='game-container'>
            <GameButton onClick={changeGameConfig}/>
            <Checkerboard/>
        </div>
    );
};


interface GameButtonProps {
    onClick: () => void;
}
/**
 *
 * @param onClick 切换游戏配置函数
 * @description 切换游戏按钮组件
 */
const GameButton: FC<GameButtonProps> = ({ onClick }) => {
    const { name } = useSelector(selectConfig);
    return (
        <div className="game-button-container">
            {GOMOKU_CONFIG.name}
            <div className={name === GOMOKU_CONFIG.name ? 'game-button-gom' : 'game-button-tic'} onClick={onClick}>
                <div className={name === GOMOKU_CONFIG.name ? 'game-button-ball-left' : 'game-button-ball-right'}></div>
            </div>
            {TICTACTOE_CONFIG.name}
        </div>
    );
};

export { Game };
