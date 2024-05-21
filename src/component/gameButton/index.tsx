import { Component } from 'react';
import { GAME_CONFIG } from '../../constant';
import { GameName } from '../../type';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { Dispatch, bindActionCreators } from '@reduxjs/toolkit';
import { changeGameConfig } from '../../store/slices/gameConfigSlice';
import './index.css';

interface GameButtonProps {
    config: RootState['configer']['config'];
    changeGameConfig: typeof changeGameConfig;
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
        const { changeGameConfig } = this.props;

        return (
            <div className='game-button-container'>
                {
                    Object.values(GameName).map((gameType) => (
                        <div
                            key={gameType}
                            className={name === GAME_CONFIG[gameType].name ? 'game-button game-button-selected' : 'game-button'}
                            onClick={() => changeGameConfig(GAME_CONFIG[gameType])}
                        >
                            {gameType}
                        </div>
                    ))
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

/**
 *
 * @param dispatch Redux store 的 dispatch
 * @returns 返回切换游戏配置的函数
 */
const mapRecordDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        { changeGameConfig },
        dispatch
    );
export const ConnectedGameButton = connect(mapStateToProps, mapRecordDispatchToProps)(GameButton);
