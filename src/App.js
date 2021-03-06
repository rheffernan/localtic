import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import './index.css';


/*class Square extends React.Component {
  
  render() {
    return (
      <button className="square" 
        onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}*/

function Square(props) {
  return( 
    <button className="square" onClick={props.onClick}>
      {props.value}
      </button>
    );
}



class Board extends React.Component {
   constructor(props) {
    super(props);

    this.state = { employees: [{name:"empty"}] };
  }
  
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
  );
  }

  refreshData() {
    var scp = this;
    fetch('/api/employees')
      .then(response => response.json())
      .then(data => scp.setState({ employees: data }));
  }

  componentDidMount() {
     this.refreshData();
  }   

  appendEmployee(name, role) {
    var scp = this;
    fetch('/api/employees', {
    method: 'post',
    body: JSON.stringify({name: name, role: role}),
    headers: {
       'Content-Type': 'application/json'
    }
    })
    .then(response => response.json())
    .then(data => scp.refreshData());
  }

  render() {
     
    return (
      <div class="card">
        <div class="card-body">
           <table class="table-bordered">
              <tr><th>Name</th><th>Role</th></tr>
              {this.state.employees.map(item => 
                 <tr key={item.id}><td>{item.name}</td><td>{item.role}</td></tr>
              )}
           </table>
           <textarea value={this.state.employees[0].name}/>
           
          <p/><button onClick={() => {this.componentDidMount();}}>Refresh</button>


          <p/>Name <input id="newname" onChange={event => this.setState({ newname: event.target.value })} />
          <p/>Role <input id="newrole" onChange={event => this.setState({ newrole: event.target.value })} />
          <p/><button onClick={() => {this.appendEmployee(this.state.newname, this.state.newrole);}}>Save</button>
        </div>

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
      history:[{
        squares: Array(9).fill(null)
               }],
      xIsNext: true,
      stepNumber: 0
    };
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) ===0
    });
  }
  
  handleClick(i)  {
     const history = this.state.history;
     const current = history[history.length - 1];
     const squares = current.squares.slice();
     if (calculateWinner(squares) || squares[i])
       return;
     
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{squares: squares}]),
          xIsNext: !this.state.xIsNext,
          stepNumber: history.length
        });
      }
  
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step,move) => {
      const desc = move ?
            'Go to move #' + move :
            'Go to game start';
      return (
      <li key={move}>
          <button onClick = {() => this.jumpTo(move)}>
            {desc}
          </button>
       </li>
            );
    });
    
    let status;
    if (winner)
      status = 'Winner: ' + winner;
    else
       status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares} 
            onClick = {(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>

         <div class="card">
            <div class="card-body">
              <h5 class="card-title">Steve Jobs</h5>
              <h6 class="card-subtitle mb-2 text-muted">steve@apple.com</h6>
              <p class="card-text">Stay Hungry, Stay Foolish</p>
              <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
            </div>
          </div>

      </div>
    );
  }
}

// ========================================

/*ReactDOM.render(
  <Game />,
  document.getElementById('root')
);*/



function calculateWinner(squares)
  {
    const lines=[
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ];
    for (let i = 0; i< lines.length; i++)
      {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
          {
            return(squares[a]);
          }
      }
     return null;
  }

export default Game;
//export {App};

