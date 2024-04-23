interface CheckerboardProps {
    size: number;
    winLength: number;
    gameType: GameName;
}
/**
 *
 * @param size 棋盘大小
 * @param winLength 胜利条件（连子个数）
 * @param gameType 游戏类型
 * @description 棋盘组件
 */
const Checkerboard: FC<CheckerboardProps> = ({ size, winLength, gameType }) => {
    // console.warn('Checkerboard render');
    const dispatch = useDispatch();
    // 落子及胜者记录
    const record = useSelector(selectRecord);
    // 棋盘二维数组
    const [checkerboard, setCheckerboard] = useState<AllGameChessmanType[][] | null>(null);
    // 当前落子玩家
    const [player, setPlayer] = useState<AllGameChessmanType>(GameChessman.X);
    // 胜者
    const [winner, setWinner] = useState<GameChessman>(GameChessman.Empty);
    // 棋盘状态所处第几条记录
    const [recordIndex, setRecordIndex] = useState<number>(0);
    // 是否平局
    const [noOneWin, setNoOneWin] = useState<boolean>(false);
    // 新落子坐标
    const [newPieceLocation, setNewPieceLocation] = useState<[number, number] | null>(null);

    // 初始化棋盘
    useEffect(() => {
        const newCheckerboard = new Array(size);
        for (let item = 0; item < size; item++) {
            newCheckerboard[item] = new Array(size).fill(GameChessman.Empty);
        }
        setCheckerboard(newCheckerboard);
        setPlayer(GameChessman.X);
        dispatch(addRecord({
            recordIndex: -1,
            chessState: {
                chessState: newCheckerboard,
                player: GameChessman.X,
                result: GameChessman.Empty,
            },
        }));
    }, [size, winLength, gameType]);

    // 点击记录后的操作
    useEffect(() => {
        if (!record) {
            return;
        }

        // 判断棋盘状态所处第几条记录
        let indexTemp = 0;
        if (record) {
            record.forEach((item, index) => {
                if (item.chessState === checkerboard) {
                    setRecordIndex(index);
                    indexTemp = index;
                }
            });
        }

        // 赋值胜者
        if (record && record[indexTemp].result === 'draw') {
            setNoOneWin(true);
        } else {
            setWinner(record[indexTemp].result as GameChessman);
        }
    }, [checkerboard, player]);

    // 落子后的操作
    useEffect(() => {
        if (winner !== GameChessman.Empty) {
            return;
        }
        if (!checkerboard) {
            return;
        }
        if (!newPieceLocation) {
            return;
        }
        if (checkerboard[newPieceLocation[0]][newPieceLocation[1]] !== GameChessman.Empty) {
            return;
        }

        // 添加新子
        const newCheckerboard = checkerboard.map((row, rowIndex) => (
            row.map((col, colIndex) => (
                rowIndex === newPieceLocation[0] && colIndex === newPieceLocation[1] ? player : col
            ))
        ));
        setCheckerboard(newCheckerboard);

        // 切换玩家
        setPlayer(player === GameChessman.X ? GameChessman.O : GameChessman.X);

        // 判断胜利并记录胜利情况
        let result: GameChessman | 'draw' | '' = '';
        const winnerTemp = judge(newPieceLocation, winLength, newCheckerboard);
        if (winnerTemp !== null) {
            setWinner(winnerTemp);
            result = winnerTemp;
        } else {
            // 平局判断
            if (record && record.length === size * size) {
                setNoOneWin(true);
                result = 'draw';
            }
        }

        // 根据棋盘状态所处第几条记录在其之后添加棋盘状态
        dispatch(addRecord({
            recordIndex,
            chessState: {
                chessState: newCheckerboard,
                player: player === GameChessman.X ? GameChessman.O : GameChessman.X,
                result,
            },
        }));
    }, [newPieceLocation]);


    /**
     *
     * @description 获取新落子的坐标
     * @param location 落子坐标
     */
    const dropPiece = useCallback((location: [number, number]) => {
        setNewPieceLocation(location);
    }, []);

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
                    <span>
                        {player} Please
                    </span>
                </div>
                {
                    checkerboard && Array(size).fill(null)
                        .map((__, rowIndex) => (
                            <div key={rowIndex} className='checkerboard-row'>
                                {
                                    Array(size).fill(null)
                                        .map((__, colIndex) => (
                                            <Piece
                                                key={colIndex}
                                                rowIndex={rowIndex}
                                                colIndex={colIndex}
                                                gameType={gameType}
                                                chessman={checkerboard.length === size ? checkerboard[rowIndex][colIndex] : GameChessman.Empty}
                                                onClick={dropPiece}
                                            />
                                        ))
                                }
                            </div>
                        ))
                }
            </div>
            {
                record &&
                <Record
                    setCheckerboard={setCheckerboard}
                    setPlayer={setPlayer}
                />
            }
        </div>
    );
};
