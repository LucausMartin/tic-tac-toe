import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { GameConfig, GameMode, FirstPlayer } from '../../type';
import { TICTACTOE_CONFIG, GOMOKU_CONFIG } from '../../constant';

interface configState {
    config: GameConfig;
}

// 使用该类型定义初始 state
const initialState: configState = { config: TICTACTOE_CONFIG };

export const recordSlice = createSlice({
    name: 'configer',
    initialState,
    reducers: {
        changeToGomoku: (state) => {
            state.config = GOMOKU_CONFIG;
        },
        changeToTicTacToe: (state) => {
            state.config = TICTACTOE_CONFIG;
        },
        changeGameModeToPVP: (state) => {
            state.config.gameMode = GameMode.PVP;
        },
        changeGameModeToPVE: (state) => {
            state.config.gameMode = GameMode.PVE;
        },
        changeFirstPlayerToPlayer: (state) => {
            state.config.firstPlayer = FirstPlayer.PLAYER;
        },
        changeFirstPlayerToAI: (state) => {
            state.config.firstPlayer = FirstPlayer.AI;
        },
    },
});

// 导出自动生成的 action 生成函数
export const { changeToGomoku, changeToTicTacToe, changeGameModeToPVP, changeGameModeToPVE, changeFirstPlayerToPlayer, changeFirstPlayerToAI } = recordSlice.actions;

// 选择器等其他代码可以使用导入的 `RootState` 类型
/**
 *
 * @param state Redux 集中管理的状态
 * @returns 记录的状态
 */
export const selectConfig = (state: RootState) => state.configer.config;

export default recordSlice.reducer;
