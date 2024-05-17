import { FC, useState } from 'react';
import { GOMOKU_CONFIG, TICTACTOE_CONFIG } from '../../constant';
import { GameName } from '../../type';
import { Checkerboard } from '../../component';
import './index.css';

/**
 *
 * @description 游戏根组件
 */
const Game: FC = () => {
    const [gameConfig, setGameConfig] = useState(TICTACTOE_CONFIG);

    /**
     * @description 切换游戏配置
     */
    const changeGameConfig = () => {
        setGameConfig(gameConfig.name === GOMOKU_CONFIG.name ? TICTACTOE_CONFIG : GOMOKU_CONFIG);
    };

    return (
        <div className='game-container'>
            <GameButton gameType={gameConfig.name} onClick={changeGameConfig}/>
            <Checkerboard gameConfig={gameConfig}/>
        </div>
    );
};


interface GameButtonProps {
    gameType: GameName;
    onClick: () => void;
}
/**
 *
 * @param gameType 游戏类型
 * @param onClick 切换游戏配置函数
 * @description 切换游戏按钮组件
 */
const GameButton: FC<GameButtonProps> = ({ gameType, onClick }) => {
    return (
        <div className="game-button-container">
            {GOMOKU_CONFIG.name}
            <div className={gameType === GOMOKU_CONFIG.name ? 'game-button-gom' : 'game-button-tic'} onClick={onClick}>
                <div className={gameType === GOMOKU_CONFIG.name ? 'game-button-ball-left' : 'game-button-ball-right'}></div>
            </div>
            {TICTACTOE_CONFIG.name}
        </div>
    );
};

export { Game };
