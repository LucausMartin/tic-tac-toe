import { FC, useState } from 'react';
import { GOMOKUCONFIG, TICTACTOECONFIG } from '../../constant';
import { GameName } from '../../type';
import { Checkerboard } from '../../component';
import './index.css';

/**
 *
 * @description 游戏根组件
 */
const Game: FC = () => {
    const [gameConfig, setGameConfig] = useState(TICTACTOECONFIG);

    /**
     * @description 切换游戏配置
     */
    const changeGameConfig = () => {
        setGameConfig(gameConfig.name === GOMOKUCONFIG.name ? TICTACTOECONFIG : GOMOKUCONFIG);
    };

    return (
        <div className='game-container'>
            <GameButton gameType={gameConfig.name} onClick={changeGameConfig}/>
            <Checkerboard size={gameConfig.size} winLength={gameConfig.winLength} gameType={gameConfig.name}/>
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
            {GOMOKUCONFIG.name}
            <div className={gameType === GOMOKUCONFIG.name ? 'game-button-gom' : 'game-button-tic'} onClick={onClick}>
                <div className={gameType === GOMOKUCONFIG.name ? 'game-button-ball-left' : 'game-button-ball-right'}></div>
            </div>
            {TICTACTOECONFIG.name}
        </div>
    );
};

export { Game };
