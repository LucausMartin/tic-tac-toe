import { Component, PureComponent } from 'react';
import { GameName, GameChessman } from '../../type';
import { Piece } from '../piece';
import { judge } from '../../tool';
import { RootState } from '../../stroe';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from '@reduxjs/toolkit';
import { addRecord } from '../../stroe/slices/recordSlice';
import './index.css';

interface CheckerboardProps {
    size: number;
    winLength: number;
    gameType: GameName;
    addRecord: typeof addRecord;
    record: RootState['record']['value'];
}

interface CheckerboardState {
    checkerboard: GameChessman[][] | null;
    player: GameChessman;
    winner: GameChessman;
    recordIndex: number;
    noOneWin: boolean;
}

class Checkerboard extends Component<CheckerboardProps, CheckerboardState> {
    constructor (props: CheckerboardProps) {
        super(props);
        const { size } = props;
        const newCheckerboard = new Array(size);
        for (let item = 0; item < size; item++) {
            newCheckerboard[item] = new Array(size).fill(GameChessman.Empty);
        }
        this.state = {
            checkerboard: newCheckerboard,
            player: GameChessman.X,
            winner: GameChessman.Empty,
            recordIndex: 0,
            noOneWin: false,
        };
        this.props.addRecord({
            recordIndex: -1,
            chessState: {
                chessState: newCheckerboard,
                player: GameChessman.X,
                result: GameChessman.Empty,
            },
        });
    }

    /**
     * @param prevProps 更新之前的 props
     */
    componentDidUpdate (prevProps: Readonly<CheckerboardProps>): void {
        // 切换游戏模式重置棋盘状态
        if (prevProps.gameType !== this.props.gameType) {
            this.clearCheckerboard();
        }
    }

    /**
     * @description 重置棋盘状态
     */
    clearCheckerboard = () => {
        const initialState = {
            checkerboard: null,
            player: GameChessman.X,
            winner: GameChessman.Empty,
            recordIndex: 0,
            noOneWin: false,
        };
        this.setState(initialState);
        const { size } = this.props;
        const newCheckerboard = new Array(size);
        for (let item = 0; item < size; item++) {
            newCheckerboard[item] = new Array(size).fill(GameChessman.Empty);
        }
        this.setState({ checkerboard: newCheckerboard });
        this.props.addRecord({
            recordIndex: -1,
            chessState: {
                chessState: newCheckerboard,
                player: GameChessman.X,
                result: GameChessman.Empty,
            },
        });
    }

    /**
     *
     * @param location 落子位置
     * @description 落子函数
     */
    dropPiece = (location: [number, number]) => {
        const { checkerboard, player, winner } = this.state;
        const { record } = this.props;
        const { size, winLength } = this.props;

        // 如果已经有胜者或者棋盘不存在不允许落子
        if (winner !== GameChessman.Empty || !checkerboard) return;
        // 如果该位置已经有棋子不允许落子
        if (checkerboard[location[0]][location[1]] !== GameChessman.Empty) return;

        // 落子
        const newCheckerboard = checkerboard.map((row, rowIndex) =>
            row.map((col, colIndex) =>
                (rowIndex === location[0] && colIndex === location[1] ? player : col)));
        this.setState({ checkerboard: newCheckerboard });

        // 切换玩家
        this.setState({ player: player === GameChessman.X ? GameChessman.O : GameChessman.X });

        // 判断胜者并记录胜利状态
        let result: GameChessman | 'draw' | '' = '';
        const winnerTemp = judge(location, winLength, newCheckerboard);
        if (winnerTemp !== null) {
            this.setState({ winner: winnerTemp });
            result = winnerTemp;
        } else {
            if (record && record.length === size * size) {
                this.setState({ noOneWin: true });
                result = 'draw';
            }
        }

        // 记录落子和胜利状态并更新记录索引
        const { recordIndex } = this.state;
        this.props.addRecord({
            recordIndex,
            chessState: {
                chessState: newCheckerboard,
                player: player === GameChessman.X ? GameChessman.O : GameChessman.X,
                result,
            },
        });
        this.setState({ recordIndex: recordIndex + 1 });
    };

    /**
     *
     * @param recordIndex 记录索引
     */
    updateRecord = (recordIndex: number) => {
        const { record } = this.props;
        this.setState({ recordIndex });
        // 先重置棋盘胜利状态
        this.setState({ noOneWin: false });
        this.setState({ winner: GameChessman.Empty });

        // 更新棋盘状态并根据记录更新胜利状态
        if (record && record[recordIndex].chessState) {
            this.setState({ checkerboard: record[recordIndex].chessState });
            this.setState({ player: record[recordIndex].player });
            if (record[recordIndex].result === 'draw') {
                this.setState({ noOneWin: true });
            } else if (record[recordIndex].result !== 'draw' && record[recordIndex].result !== GameChessman.Empty) {
                this.setState({ winner: record[recordIndex].result as GameChessman });
            }
        }
    }

    render () {
        const { size, gameType } = this.props;
        const { checkerboard, player, winner, noOneWin } = this.state;

        return (
            <div className='checkerboard-container'>
                <div className='checkerboard-chess-container'>
                    <div className='checkerboard-chess-no-one-win'>{noOneWin && 'draw'}</div>
                    <div className='checkerboard-chess-info'>
                        <span>
                        Winner: {gameType === GameName.TICTACTOE ? winner
                                : <>{winner === GameChessman.Empty ? ''
                                    : <>{winner === GameChessman.X ? 'Black' : 'White'}</>}</>}
                        </span>
                        <span>{player} Please</span>
                    </div>
                    {checkerboard &&
                      Array(size)
                          .fill(null)
                          .map((__, rowIndex) => (
                              <div key={rowIndex} className='checkerboard-row'>
                                  {Array(size)
                                      .fill(null)
                                      .map((__, colIndex) => (
                                          <Piece
                                              key={colIndex}
                                              rowIndex={rowIndex}
                                              colIndex={colIndex}
                                              gameType={gameType}
                                              chessman={checkerboard.length === size ? checkerboard[rowIndex][colIndex] : GameChessman.Empty}
                                              onClick={this.dropPiece}
                                          />
                                      ))}
                              </div>
                          ))}
                </div>
                {
                    this.props.record &&
                    <ConnectedRecord
                        updateRecord={this.updateRecord}
                    />
                }
            </div>
        );
    }
}

interface RecordProps {
    record: RootState['record']['value'];
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
        console.warn('record render');
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
const mapStateToProps = (state: RootState) => ({ record: state.record.value });

/**
 *
 * @param dispatch Redux store 的 dispatch
 * @returns 返回 addRecord 函数
 */
const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        { addRecord },
        dispatch
    );


export const ConnectedCheckerboard = connect(mapStateToProps, mapDispatchToProps)(Checkerboard);
export const ConnectedRecord = connect(mapStateToProps, mapDispatchToProps)(Record);
