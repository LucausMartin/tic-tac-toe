import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { GameChessman, RecordType, AllGameChessmanType } from '../../type';

interface RecordState {
    record: RecordType[] | null;
}

// 使用该类型定义初始 state
const initialState: RecordState = { record: null };

export const recordSlice = createSlice({
    name: 'recorder',
    initialState,
    reducers: {
        addRecord: (state, action: PayloadAction<{
            recordIndex: number;
            chessState: RecordType;
        }>) => {
            if (state.record) {
                state.record.splice(action.payload.recordIndex + 1, state.record.length - action.payload.recordIndex);
                state.record.push(action.payload.chessState);
            } else {
                state.record = [action.payload.chessState];
            }
        },
        initialRecord: (state, action: PayloadAction<{
            checkerboard: AllGameChessmanType[][];
        }>) => {
            state.record = [{
                chessState: action.payload.checkerboard,
                player: GameChessman.X,
                result: GameChessman.Empty,
            }];
        },
    },
});

// 导出自动生成的 action 生成函数
export const { addRecord, initialRecord } = recordSlice.actions;

// 选择器等其他代码可以使用导入的 `RootState` 类型
/**
 *
 * @param state Redux 集中管理的状态
 * @returns 记录的状态
 */
export const selectRecord = (state: RootState) => state.recorder.record;

export default recordSlice.reducer;
