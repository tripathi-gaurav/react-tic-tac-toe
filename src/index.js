import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

/*
leaving this dead code for my learning
Change this React component to function component
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => {
          //this.setState({ value: "X" });
          this.props.onClick();
        }}
      >
        {this.props.value}
      </button>
    );
  }
}
*/

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  /* UPDATE: lift up the props to the Game component
  * UPDATE: remove this constructor
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      turn: "X",
      xIsNext: true
    };
  }
  */

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    //UPDATE: uplifted the render method to board component
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if (winner) {
    //   status = "Winner : " + winner;
    // } else {
    //   status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    // }

    return (
      <div>
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
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      turn: "X",
      stepNumber: 0
    };
  }

  handleClick(i) {
    //const history = this.state.history;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    console.log(squares);
    const winner = calculateWinner(squares);

    if (winner || squares[i]) {
      return;
    }

    var turn = this.state.turn;
    squares[i] = turn;
    console.log("previous turn : " + squares[i]);
    if (turn === "X") turn = "O";
    else turn = "X";
    squares[i] = this.state.xIsNext ? "xx" : "oo";
    this.setState({
      history: history.concat([{ squares: squares }]), //[...history, squares],
      xIsNext: !this.state.xIsNext,
      turn: turn,
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 == 0,
      turn: step % 2 == 0 ? "X" : "O"
    });
  }

  render() {
    const history = this.state.history;
    /*
    modify the Game component’s render method from always rendering the last move
     to rendering the currently selected move according to stepNumber
    */
    const current = history[this.state.stepNumber];
    console.log("render() : " + current);
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner : " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  console.log(squares);
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
