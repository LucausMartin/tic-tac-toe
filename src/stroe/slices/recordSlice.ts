import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { RecordType } from '../../type';

interface RecordState {
    value: RecordType[] | null;
}

// 使用该类型定义初始 state
const initialState: RecordState = { value: null };

export const recordSlice = createSlice({
    name: 'record',
    initialState,
    reducers: {
        addRecord: (state, action: PayloadAction<{
            recordIndex: number;
            chessState: RecordType;
        }>) => {
            if (state.value) {
                state.value.splice(action.payload.recordIndex + 1, state.value.length - action.payload.recordIndex);
                state.value.push(action.payload.chessState);
            } else {
                state.value = [action.payload.chessState];
            }
        },
    },
});

// 导出自动生成的 action 生成函数
export const { addRecord } = recordSlice.actions;

// 选择器等其他代码可以使用导入的 `RootState` 类型
/**
 *
 * @param state Redux 集中管理的状态
 * @returns 记录的状态
 */
export const selectRecord = (state: RootState) => state.record.value;

export default recordSlice.reducer;
