import { Component } from 'react';
import { ConnectedCheckerboard, ConnectedGameButton } from '../../component';
import './index.css';

/**
 * @description 游戏根组件
 */
class Game extends Component {
    render () {
        return (
            <div className='game-container'>
                <ConnectedGameButton />
                <ConnectedCheckerboard />
            </div>
        );
    }
}

export  { Game };
