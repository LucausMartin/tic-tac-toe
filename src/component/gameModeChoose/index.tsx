import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from '@reduxjs/toolkit';
import { changeGameModeToPVP, changeGameModeToPVE, changeFirstPlayerToPlayer, changeFirstPlayerToAI } from '../../store/slices/gameConfigSlice';
import { GameConfig, FirstPlayer, GameMode } from '../../type';
import { RootState } from '../../store';
import './index.css';

interface GameModeProps {
    config: GameConfig;
    changeGameModeToPVP: typeof changeGameModeToPVP;
    changeGameModeToPVE: typeof changeGameModeToPVE;
    changeFirstPlayerToPlayer: typeof changeFirstPlayerToPlayer;
    changeFirstPlayerToAI: typeof changeFirstPlayerToAI;
}

/**
 *
 * @param config 游戏配置
 * @param changeGameModeToPVP 切换对战模式为 PVP
 * @param changeGameModeToPVE 切换对战模式为 PVE
 * @param changeFirstPlayerToPlayer 切换先手玩家为玩家
 * @param changeFirstPlayerToAI 切换先手玩家为 AI
 * @description 游戏模式选择组件
 */
class GameModeChoose extends PureComponent<GameModeProps> {
    constructor (props: GameModeProps) {
        super(props);
    }

    chooseGameMode = (gameMode: GameMode) => {
        if (gameMode === GameMode.PVP) {
            this.props.changeGameModeToPVP();
        } else {
            this.props.changeGameModeToPVE();
        }
    }

    chooseFirstPlayer = (firstPlayer: FirstPlayer) => {
        if (firstPlayer === FirstPlayer.PLAYER) {
            this.props.changeFirstPlayerToPlayer();
        } else {
            this.props.changeFirstPlayerToAI();
        }
    }

    render () {
        const { gameMode, firstPlayer } = this.props.config;
        return (
            <>
                {gameMode === GameMode.NONE &&
                <div>
                    <span className='checkerboard-choose'>choose game mode</span>
                    <div className='checkerboard-choose-first'>
                        <button className='checkerboard-choose-first-button' onClick={
                            () => this.chooseGameMode(GameMode.PVP)
                        }>PVP</button>
                        <button className='checkerboard-choose-first-button' onClick={
                            () => this.chooseGameMode(GameMode.PVE)
                        }>PVE</button>
                    </div>
                </div>}
                {gameMode === GameMode.PVE && firstPlayer === FirstPlayer.NONE &&
                <div>
                    <span className='checkerboard-choose'>choose first player</span>
                    <div className='checkerboard-choose-first'>
                        <button className='checkerboard-choose-first-button' onClick={
                            () => this.chooseFirstPlayer(FirstPlayer.PLAYER)
                        }>player</button>
                        <button className='checkerboard-choose-first-button' onClick={
                            () => this.chooseFirstPlayer(FirstPlayer.AI)
                        }>AI</button>
                    </div>
                </div>}
            </>
        );
    }
}

/**
 *
 * @param state Redux 集中管理的状态
 * @returns 返回游戏配置状态
 */
const mapConfigStateToProps = (state: RootState) => ({ config: state.configer.config });

/**
 *
 * @param dispatch Redux store 的 dispatch
 * @returns 返回改变对战模式和先手玩家的函数
 */
const mapGameModeChooseDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        { changeGameModeToPVP, changeGameModeToPVE, changeFirstPlayerToPlayer, changeFirstPlayerToAI },
        dispatch
    );

export const ConnectedGameModeChoose = connect(mapConfigStateToProps, mapGameModeChooseDispatchToProps)(GameModeChoose);
