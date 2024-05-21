import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { GameConfig } from '../../type';
import { TICTACTOE_CONFIG } from '../../constant';

interface configState {
    config: GameConfig;
}

// 使用该类型定义初始 state
const initialState: configState = { config: TICTACTOE_CONFIG };

export const recordSlice = createSlice({
    name: 'configer',
    initialState,
    reducers: {
        changeGameConfig: (state, action) => {
            state.config = action.payload;
        },
        changeGameMode: (state, action) => {
            state.config.gameMode = action.payload;
        },
        changeFirst: (state, action) => {
            state.config.firstPlayer = action.payload;
        },
    },
});

// 导出自动生成的 action 生成函数
export const { changeGameConfig, changeGameMode, changeFirst } = recordSlice.actions;

// 选择器等其他代码可以使用导入的 `RootState` 类型
/**
 *
 * @param state Redux 集中管理的状态
 * @returns 记录的状态
 */
export const selectConfig = (state: RootState) => state.configer.config;

export default recordSlice.reducer;
