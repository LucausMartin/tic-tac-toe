import { PureComponent } from 'react';
import { RootState } from '../../store';
import { connect } from 'react-redux';
import './index.css';

interface RecordProps {
    record: RootState['recorder']['record'];
    updateRecord: (recordIndex: number) => void;
}
/**
 *
 * @param record 落子及胜者记录
 * @param updateRecord 更新记录函数
 * @description 落子及胜者记录展示组件
 */
class Record extends PureComponent<RecordProps> {
    constructor (props: RecordProps) {
        super(props);
    }

    render () {
        return (
            <div className='record-container'>
                {
                    this.props.record && this.props.record.map((__, index) => (
                        <div key={index}>
                            <button className='record-button' onClick={
                                () => this.props.updateRecord(index)
                            }>move to {index}</button>
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
 * @returns 返回记录状态
 */
const mapRecordStateToProps = (state: RootState) => ({ record: state.recorder.record });

export const ConnectedRecord = connect(mapRecordStateToProps)(Record);
