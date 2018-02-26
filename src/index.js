import React from 'react';
import ReactDOM from 'react-dom';
import chunk from 'lodash/chunk';
import './index.css';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          history: [{
            squares: Array(9).fill(null),
            x: null,
            y: null
          }],
          xIsNext: true,
          stepNumber: 0,
          sortAscending: true
        };
    }

    handleClick = (i) => {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        console.log(i);
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        let x, y;
        if([0, 1, 2].includes(i)){
            x = 1;
            y = (i == 0) ? 1 : (i == 1) ? 2 : 3;
        }
        else if([3, 4, 5].includes(i)){
            x = 2;
            y = (i == 3) ? 1 : (i == 4) ? 2 : 3;
        }
        else{
            x = 3;
            y = (i == 6) ? 1 : (i == 7) ? 2 : 3;
        }
        squares[i] = this.state.xIsNext ? 'x' : 'o';
        this.setState({
            history: history.concat([{
                squares: squares,
                x: x,
                y: y
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }
    jumpTo = (step) => {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    };

    sortMoves = () => {
        let sortOrder = !this.state.sortAscending;


        this.setState({
            sortAscending: sortOrder
        })
    };

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let styles = {
            fontWeight:'bold'
        };

        let moves = history.map((step, move) => {
            const loc = '('+step.x+', '+step.y+')';
            const desc = move ? 'Go to move #' + move + ' at ' + loc: 'Go to game start';
            if(move != this.state.stepNumber){
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }
            else{
                return (
                    <li key={move}>
                        <button style={styles} onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }
            
        });
        if(!this.state.sortAscending){
            moves = moves.reverse();
        }
        const status = winner ? 'Winner: ' + winner : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        return (
            <div className='game'>
                <div className='game-board'>
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className='game-info'>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <SortButton onClick={() => this.sortMoves()} sortAscending={this.state.sortAscending} />
            </div>
        );
    }
}

class SortButton extends React.Component {
    render() {
        const text = this.props.sortAscending ? 'Sort Descending' : 'Sort Ascending';
        return (
            <div>
                <button onClick={() => this.props.onClick()}>{text}</button> 
            </div>
        )
    }
}

class Board extends React.Component {
    renderSquare = (i) => {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
    };

    render() {
        return (
            <div>
                {chunk(new Array(9).fill(null), 3).map((item, itemIndex) => {
                    return (
                        <div key={itemIndex} className='board-row'>
                            {item.map((col, index) => <Square key={itemIndex+index} value={this.props.squares[(3*itemIndex) + index]} onClick={() => this.props.onClick((3*itemIndex) + index)} />)}
                        </div>
                    )
                })}
            </div>
        )
        

    }
}

function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    )
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
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

ReactDOM.render(<Game />, document.getElementById('root'));
