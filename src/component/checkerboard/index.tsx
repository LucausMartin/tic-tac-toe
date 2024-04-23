import { Component } from 'react';
import { GameName, GameChessman } from '../../type';
import { Piece } from '../piece';
import { judge } from '../../tool';
import './index.css';
import { RootState } from '../../stroe';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from '@reduxjs/toolkit';
import { addRecord } from '../../stroe/slices/recordSlice';

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

    initialState = {
        checkerboard: null,
        player: GameChessman.X,
        winner: GameChessman.Empty,
        recordIndex: 0,
        noOneWin: false,
    };
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
     * @param prevProps 更新之前的 props
     */
    componentDidUpdate (prevProps: Readonly<CheckerboardProps>): void {
        // 切换游戏模式重置棋盘状态
        if (prevProps.gameType !== this.props.gameType) {
            this.setState(this.initialState);
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
                        setCheckerboard={(checkerboard: CheckerboardState['checkerboard']) => this.setState({ checkerboard })}
                        setPlayer={(player: CheckerboardState['player']) => this.setState({ player })}
                        setRecordIndex={(recordIndex: CheckerboardState['recordIndex']) => this.setState({ recordIndex })}
                        setNoOneWin={(noOneWin: CheckerboardState['noOneWin']) => this.setState({ noOneWin })}
                        setWinner={(winner: CheckerboardState['winner']) => this.setState({ winner })}
                    />
                }
            </div>
        );
    }
}

interface RecordProps {
    record: RootState['record']['value'];
    setCheckerboard: (checkerboard: CheckerboardState['checkerboard']) => void;
    setPlayer: (player: CheckerboardState['player']) => void;
    setRecordIndex: (recordIndex: CheckerboardState['recordIndex']) => void;
    setNoOneWin: (noOneWin: CheckerboardState['noOneWin']) => void;
    setWinner: (winner: CheckerboardState['winner']) => void;
}
/**
 *
 * @param record 落子及胜者记录
 * @param setCheckerboard 设置棋盘状态
 * @param setPlayer 设置当前落子玩家
 * @param setRecordIndex 设置当前记录索引
 * @param setNoOneWin 设置是否平局
 * @description 落子及胜者记录展示组件
 */
class Record extends Component<RecordProps> {
    constructor (props: RecordProps) {
        super(props);
    }

    /**
     *
     * @param step 需要移动到的步数
     * @returns 返回移动到指定步数的函数
     */
    moveToStep = (step: number) => {
        const { record } = this.props;
        return () => {
            if (record && record[step].chessState) {
                // 点击记录更新棋盘、玩家、记录索引、是否平局、胜者
                this.props.setCheckerboard(record[step].chessState);
                this.props.setPlayer(record[step].player);
                this.props.setRecordIndex(step);
                this.props.setNoOneWin(false);
                this.props.setWinner(GameChessman.Empty);

                // 根据记录更新是否平局和胜者
                if (record && record[step].result === 'draw') {
                    this.props.setNoOneWin(true);
                } else if (record && record[step].result !== 'draw' && record[step].result !== GameChessman.Empty) {
                    this.props.setWinner(record[step].result as GameChessman);
                }
            }
        };
    };

    render () {
        return (
            <div className='record-container'>
                {
                    this.props.record && this.props.record.map((__, index) => (
                        <div key={index}>
                            <button className='record-button' onClick={this.moveToStep(index)}>move to {index}</button>
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
