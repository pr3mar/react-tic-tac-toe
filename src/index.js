import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                value: null,
        };
    }

    render() {
        return (
            <button 
                className="square"
                onClick={ () => this.props.onClick() }
            >
                { this.props.value }
            </button>
        );
    }
}*/

function Square(props) {
    let red = {color:'red'}
    return(
        <button className="square" onClick={props.onClick}>
            {props.highlight ? <b style={red}>{props.value}</b> : props.value}
        </button>
    );
}

function BoardRow(props) {
    let columns = [];
    let columnSize = 3;
    for(let i = 0; i < columnSize; i++) {
        const cellId = i + props.rowId * 3;
        columns.push(
            <Square 
                key = {cellId}
                value = {props.squares[cellId]}
                onClick = {() => props.onClick(cellId)}
                highlight = {props.line ? props.line.includes(cellId) : false}
            />
        );
    }
    return (
        <div className="board-row">
            {columns}
        </div>
    )
}

class Board extends React.Component {

    /*constructor(props){
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }*/

    // handleClick(i) {
    //     const squares = this.state.squares.slice();
    //     if(calculateWinner(squares) || squares[i]) {
    //         return;
    //     }
    //     squares[i] = this.state.xIsNext ? 'X' : 'O';
    //     this.setState({ 
    //         squares: squares,
    //         xIsNext: !this.state.xIsNext
    //      });
    // }

    renderSquare(i) {
        // console.log('Rendering', i);
        return (
            <Square
                // value={this.state.squares[i]} 
                // onClick={() => this.handleClick(i) }
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i) }
                line ={this.props.line}
            />
        )
    }

    render() {
        // const winner = calculateWinner(this.state.squares);
        // let status;
        // if(winner) {
        //     status = 'Winner = ' + winner;
        // } else {
        //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        // }
        /*return (
            <div>
                {// <div className="status">{status}</div> }
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );*/
        const board = [];
        const rowCount = 3;
        for(let i = 0; i < rowCount; i++) {
            board.push(
                <BoardRow
                    key={i}
                    rowId = {i}
                    squares = {this.props.squares}
                    onClick = {this.props.onClick}
                    line = {this.props.line}
                />
            )
        }
        // console.log(board);
        return (
            <div>
                {board}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                changed: -1
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        console.log(squares);
        const {winner, line}  = calculateWinner(squares)
        if(winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({ 
            history: history.concat([{
                squares: squares,
                changed: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
         });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const stepNumber = this.state.stepNumber;
        const current = history[stepNumber];
        const squares = current.squares;
        const {winner, line} = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const {squares, changed} = step;
            let desc = move ?
                'Go to move #' + move + " => (" + Math.floor(changed/3) + ", " + changed % 3 + ")"
                : 'Go to game start';
            desc = move === stepNumber ? <b>{desc}</b> : desc;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} >{ desc }</button>
                </li>
            )
        });

        let status, movesLeft = 'Moves left: ';
        if(winner) {
            status = 'Winner = ' + winner;
            movesLeft +=  0;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            movesLeft += (squares.length - (squares.filter(x => !!x)).length);
        }
        return (
        <div className="game">
            <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                line={line}
            />
            </div>
            <div className="game-info">
            <div>{ status }</div>
            <div>{ movesLeft } </div>
            <ol>{ moves }</ol>
            </div>
        </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for(let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            // return squares[a];
            return { winner: squares[a], line: lines[i] };
        }
    }
    return { winner: null, line: null };
}
  
// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  