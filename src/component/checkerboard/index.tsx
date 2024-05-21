import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from '@reduxjs/toolkit';
import { addRecord, initialRecord } from '../../store/slices/recordSlice';
import { GameName, GameChessman, GameConfig, FirstPlayer, GameMode } from '../../type';
import { judge, findBestLocation } from '../../tool';
import { RootState } from '../../store';
import { ConnectedPiece, ConnectedRecord, ConnectedGameModeChoose } from '../index';
import './index.css';

interface CheckerboardProps {
    config: GameConfig;
    addRecord: typeof addRecord;
    initialRecord: typeof initialRecord;
    record: RootState['recorder']['record'];
}

interface CheckerboardState {
    checkerboard: GameChessman[][] | null;
    player: GameChessman;
    winner: GameChessman | 'none';
    recordIndex: number;
}

/**
 * @description 棋盘组件
 * @param config 游戏配置
 * @param record 记录
 * @param addRecord 添加记录
 * @param initialRecord 初始化记录
 */
class Checkerboard extends Component<CheckerboardProps, CheckerboardState> {
    constructor (props: CheckerboardProps) {
        super(props);
        const { size } = props.config;
        const newCheckerboard = new Array(size).fill(null)
            .map(() => new Array(size).fill(GameChessman.Empty));
        this.state = {
            checkerboard: newCheckerboard,
            player: GameChessman.X,
            winner: GameChessman.Empty,
            recordIndex: 0,
        };
        this.props.initialRecord({ checkerboard: newCheckerboard });
    }

    /**
     * @param prevProps 更新之前的 props
     */
    componentDidUpdate (prevProps: Readonly<CheckerboardProps>): void {
        // 切换游戏模式重置棋盘状态
        if (prevProps.config.name !== this.props.config.name) {
            this.clearCheckerboard();
        }
        if (prevProps.config.firstPlayer !== this.props.config.firstPlayer) {
            if (this.props.config.firstPlayer === FirstPlayer.AI) {
                this.aiDropPiece(this.state.checkerboard as GameChessman[][]);
            }
        }
    }

    /**
     * @description 重置棋盘状态
     */
    clearCheckerboard = () => {
        const { size } = this.props.config;
        const newCheckerboard = new Array(size).fill(null)
            .map(() => new Array(size).fill(GameChessman.Empty));
        const initialState = {
            checkerboard: newCheckerboard,
            player: GameChessman.X,
            winner: GameChessman.Empty,
            recordIndex: 0,
            noOneWin: false,
        };
        this.setState(initialState);
        this.props.initialRecord({ checkerboard: newCheckerboard });
    }

    /**
     *
     * @param location 落子位置
     * @description 落子函数
     */
    dropPiece = (location: [number, number]) => {
        const { checkerboard, player, winner } = this.state;
        const { record } = this.props;
        const { size, winLength } = this.props.config;

        // 如果已经有胜者或者棋盘不存在不允许落子
        if (winner !== GameChessman.Empty || !checkerboard) return;
        // 如果该位置已经有棋子不允许落子
        if (checkerboard[location[0]][location[1]] !== GameChessman.Empty) return;

        // 落子
        const newCheckerboard = checkerboard.map((row, rowIndex) =>
            row.map((col, colIndex) =>
                (rowIndex === location[0] && colIndex === location[1] ? player : col)));


        // 判断胜者并记录胜利状态
        let result: GameChessman | 'none' = GameChessman.Empty;
        const winnerTemp = judge(location, winLength, newCheckerboard);
        if (winnerTemp !== null) {
            this.setState({ winner: winnerTemp });
            result = winnerTemp;
        } else {
            if (record && record.length === size * size) {
                this.setState({ winner: 'none' });
                result = 'none';
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

        this.setState({
            checkerboard: newCheckerboard,
            player: player === GameChessman.X ? GameChessman.O : GameChessman.X,
            recordIndex: recordIndex + 1,
            winner: result,
        }, () => {
            this.isAIDropPiece(newCheckerboard);
        });
    };

    /**
     *
     * @param recordIndex 记录索引
     */
    updateRecord = (recordIndex: number) => {
        const { record } = this.props;

        // 更新棋盘状态并根据记录更新胜利状态
        if (record && record[recordIndex].chessState) {
            let result: GameChessman | 'none' = GameChessman.Empty;
            if (record[recordIndex].result === 'none') {
                result = 'none';
            } else if (record[recordIndex].result !== 'none' && record[recordIndex].result !== GameChessman.Empty) {
                result = record[recordIndex].result as GameChessman;
            }
            this.setState({ checkerboard: record[recordIndex].chessState, player: record[recordIndex].player, winner: result, recordIndex }, () => {
                this.isAIDropPiece(record[recordIndex].chessState);
            });
        }
    }

    /**
     * @description AI 落子
     */
    aiDropPiece = (newCheckerboard: GameChessman[][]) => {
        const { config } = this.props;
        const { player } = this.state;
        const location = findBestLocation(newCheckerboard, player, config);
        this.dropPiece(location);
    }

    /**
     * @description 判断是否轮到 AI 落子
     */
    isAIDropPiece = (newCheckerboard: GameChessman[][]) => {
        const { firstPlayer } = this.props.config;
        const { player } = this.state;
        if (firstPlayer === FirstPlayer.AI && player === GameChessman.X) {
            this.aiDropPiece(newCheckerboard);
        }
        if (firstPlayer === FirstPlayer.PLAYER && player === GameChessman.O) {
            this.aiDropPiece(newCheckerboard);
        }
    }

    render () {
        const { size, name, firstPlayer, gameMode } = this.props.config;
        const { checkerboard, player, winner } = this.state;

        return (
            <>
                <ConnectedGameModeChoose />
                {((firstPlayer !== FirstPlayer.NONE && gameMode !== GameMode.NONE) || gameMode === GameMode.PVP) &&
                <div className='checkerboard-container'>
                    <div className='checkerboard-chess-container'>
                        <div className='checkerboard-chess-info'>
                            {name !== GameName.GOMOKU && <span>
                        Winner: {winner}
                            </span>}
                            {name === GameName.GOMOKU && <span>
                        Winner: {
                                    winner === GameChessman.X ? 'Black' : <>{winner === GameChessman.O ? 'White' : winner}</>
                                }
                            </span>}
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
                                          <ConnectedPiece
                                              key={colIndex}
                                              rowIndex={rowIndex}
                                              colIndex={colIndex}
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
                </div>}
            </>
        );
    }
}


/**
 *
 * @param state Redux 集中管理的状态
 * @returns 返回记录和配置状态
 */
const mapAllStateToProps = (state: RootState) => ({ record: state.recorder.record, config: state.configer.config });

/**
 *
 * @param dispatch Redux store 的 dispatch
 * @returns 返回添加和初始化记录的函数
 */
const mapRecordDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        { addRecord, initialRecord },
        dispatch
    );


export const ConnectedCheckerboard = connect(mapAllStateToProps, mapRecordDispatchToProps)(Checkerboard);
