import { Component } from 'react';
import { GOMOKUCONFIG, TICTACTOECONFIG } from '../../constant';
import { GameName } from '../../type';
import { ConnectedCheckerboard } from '../../component';
import './index.css';

/**
 * @description 游戏根组件
 */
class Game extends Component {
    constructor (props: {}) {
        super(props);
    }

    state = { gameConfig: TICTACTOECONFIG };

    changeGameConfig = () => {
        this.setState({ gameConfig: this.state.gameConfig.name === GOMOKUCONFIG.name ? TICTACTOECONFIG : GOMOKUCONFIG });
    };

    render () {
        return (
            <div className='game-container'>
                <GameButton gameType={this.state.gameConfig.name} onClick={this.changeGameConfig}/>
                <ConnectedCheckerboard size={this.state.gameConfig.size} winLength={this.state.gameConfig.winLength} gameType={this.state.gameConfig.name} />
            </div>
        );
    }
}

interface GameButtonProps {
    gameType: GameName;
    onClick: () => void;
}
/**
 * @description 切换游戏按钮组件
 * @param gameType 游戏类型
 * @param onClick 切换游戏配置函数
 */
class GameButton extends Component<GameButtonProps> {
    constructor (props: GameButtonProps) {
        super(props);
    }

    render () {
        return (
            <div className='game-button-container'>
                {GOMOKUCONFIG.name}
                <div className={this.props.gameType === GOMOKUCONFIG.name ? 'game-button-gom' : 'game-button-tic'} onClick={this.props.onClick}>
                    <div className={this.props.gameType === GOMOKUCONFIG.name ? 'game-button-ball-left' : 'game-button-ball-right'}></div>
                </div>
                {TICTACTOECONFIG.name}
            </div>
        );
    }
}

export { Game };
