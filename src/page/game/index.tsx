import { Component } from 'react';
import { GOMOKU_CONFIG, TICTACTOE_CONFIG } from '../../constant';
import { ConnectedCheckerboard } from '../../component';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { Dispatch, bindActionCreators } from '@reduxjs/toolkit';
import { changeToGomoku, changeToTicTacToe } from '../../store/slices/gameConfigSlice';
import './index.css';

interface GameProps {
    config: RootState['configer']['config'];
    changeToGomoku: typeof changeToGomoku;
    changeToTicTacToe: typeof changeToTicTacToe;
}
/**
 * @description 游戏根组件
 */
class Game extends Component<GameProps> {
    constructor (props: GameProps) {
        super(props);
    }

    changeGameConfig = () => {
        const { name } = this.props.config;
        const { changeToGomoku, changeToTicTacToe } = this.props;
        if (name === GOMOKU_CONFIG.name) {
            changeToTicTacToe();
        } else {
            changeToGomoku();
        }
    };

    render () {
        return (
            <div className='game-container'>
                <ConnectedGameButton onClick={this.changeGameConfig}/>
                <ConnectedCheckerboard />
            </div>
        );
    }
}

interface GameButtonProps {
    config: RootState['configer']['config'];
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
        const { name } = this.props.config;
        const { onClick } = this.props;
        return (
            <div className='game-button-container'>
                {GOMOKU_CONFIG.name}
                <div className={name === GOMOKU_CONFIG.name ? 'game-button-gom' : 'game-button-tic'} onClick={onClick}>
                    <div className={name === GOMOKU_CONFIG.name ? 'game-button-ball-left' : 'game-button-ball-right'}></div>
                </div>
                {TICTACTOE_CONFIG.name}
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

/**
 *
 * @param dispatch Redux store 的 dispatch
 * @returns 返回 changeToGomoku 和 changeToTicTacToe 函数
 */
const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        { changeToGomoku, changeToTicTacToe },
        dispatch
    );

export const ConnectedGame = connect(mapStateToProps, mapDispatchToProps)(Game);
export const ConnectedGameButton = connect(mapStateToProps)(GameButton);
