import React from 'react';
import axios from "axios/index";
import {
  Button,
  CircularProgress,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography
} from "material-ui";
import {KeyboardArrowDown} from 'material-ui-icons';
import {Link} from "react-router-dom";
import AddPlayers from "../add/AddPlayers";
import AddScore from "../add/AddScore";

class Game extends React.Component {

  constructor(props) {
    super();
    this.state = {status: "Loading"};
    this.getGame = this.getGame.bind(this);
    this.scoreGame = this.scoreGame.bind(this);
    this.getGame(props.match.params.id);
  }

  getGame(id) {
    axios.get('/api/game/' + id)
      .then(response => {
        this.setState({
          status: "OK",
          id: id,
          game: response.data,
        })
      })
      .catch(error => {
        console.log(error)
      });
  }

  scoreGame(event) {
    event.preventDefault();
    axios.post("/api/game/" + this.state.id)
      .then(response => {
        this.getGame(this.state.id);
        console.log("created at " + response.headers.location);
      })
      .catch(function (error) {
        if(error.response && error.response.status === 401){
          window.location.href = '/login';
        } else {
          console.log(error);
        }
      });
  }

  addPlayers(team) {
    return (
      <ExpansionPanel key={team} className={'add-to-' + this.state.game.teams[team].name.replace(/\s+/g, '-').toLowerCase()}>
        <ExpansionPanelSummary expandIcon={<KeyboardArrowDown />}>
          <Typography className={"add_players"}>Add players to {this.state.game.teams[team].name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <AddPlayers id={this.state.game.id} team={team} game={this.state.game} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }

  static genFullScores(playerGame) {
    return (<tbody key={playerGame.id + "-full"}>
    <tr>
      <td rowSpan={2}>{Number.isInteger(playerGame.handicap) ? playerGame.handicap: ""}</td>
      <td rowSpan={2}>{playerGame.player ? playerGame.player.name: ""}</td>
      <td>{playerGame.scores[0].scratch}</td>
      <td>{playerGame.scores[0].handicapped}</td>
      <td>{playerGame.scores[1].scratch}</td>
      <td>{playerGame.scores[1].handicapped}</td>
      <td>{playerGame.scores[2].scratch}</td>
      <td>{playerGame.scores[2].handicapped}</td>
      <td>{playerGame.scores[3].scratch}</td>
      <td>{playerGame.scores[3].handicapped}</td>
      <td rowSpan={2}>{playerGame.scores.reduce((a, b) => a + b.score, 0)}</td>
    </tr>
    <tr>
      <td colSpan={2}>{playerGame.scores[0].score}</td>
      <td colSpan={2}>{playerGame.scores[1].score}</td>
      <td colSpan={2}>{playerGame.scores[2].score}</td>
      <td colSpan={2}>{playerGame.scores[3].score}</td>
    </tr>
    </tbody>)
  }

  genScores(playerGame) {
    if(playerGame.scores.length < 3) {
      let i = 0;
      const data = [[
        <React.Fragment key={playerGame.id + "-player"}>
          <td rowSpan={2}>{playerGame.handicap}</td>
          <td rowSpan={2}>{playerGame.player.name}</td>
        </React.Fragment>]];
      playerGame.scores.forEach(score => {
        i++;
        data.push([
          <React.Fragment key={score.id}>
            <td key={score.id + "-scratch"}>{Number.isInteger(score.scratch) ? score.scratch : ""}</td>
            <td key={score.id + "-handicapped"}>{Number.isInteger(score.handicapped) ? score.handicapped : ""}</td>
          </React.Fragment>,
          <td colSpan={2} key={score.id + "-score"}>{score.score ? score.score : ""}</td>
        ])
      });
      if (this.state.game.playerGames.length === 6){
        data.push([
          <td colSpan={2} rowSpan={2} key={playerGame.id + "-addScore"}>
            <AddScore id={playerGame.id} name={playerGame.player.name.replace(/\s+/g, '-').toLowerCase()}/>
          </td>]);
      } else {
        data.push([
          <React.Fragment key={playerGame.id + "-" + "would-be-j"}>
            <td key={"would-be-j" + "-0"}/>
            <td key={"would-be-j" + "-1"}/>
          </React.Fragment>,
          <td key={"would-be-j" + "-2"} colSpan={2} />
        ]);
      }
      for (let j = i; j<2; j++) {
        data.push([
          <React.Fragment key={playerGame.id + "-" + j}>
            <td key={j + "-0"}/>
            <td key={j + "-1"}/>
          </React.Fragment>,
          <td key={j + "-2"} colSpan={2} />
        ]);
      }
      data.push([
        <React.Fragment key={playerGame.id + "-totals"}>
          <td>totals</td>
          <td>totals</td>
          <td rowSpan={2}>Points</td>
        </React.Fragment>,
        <td key={playerGame.id + "-scoreTotals"} colSpan={2}>totals</td>]);
      return (
        <tbody key={playerGame.id + "-table"}>
          <tr>
            {data.map(thing => thing[0])}
          </tr>
          <tr>
            {data.map(thing => thing[1])}
          </tr>
        </tbody>
      )
    } else {
      return (
        <tbody id={playerGame.player.name.replace(/\s+/g, '-').toLowerCase() + "-full"} key={playerGame.id + "-full"}>
        <tr>
          <td rowSpan={2}>{playerGame.handicap}</td>
          <td rowSpan={2}>{playerGame.player.name}</td>
          <td>{playerGame.scores[0] !== null ? playerGame.scores[0].scratch : ""}</td>
          <td>{playerGame.scores[0] !== null ? playerGame.scores[0].handicapped : ""}</td>
          <td>{playerGame.scores[1] !== null ? playerGame.scores[1].scratch : ""}</td>
          <td>{playerGame.scores[1] !== null ? playerGame.scores[1].handicapped : ""}</td>
          <td>{playerGame.scores[2] !== null ? playerGame.scores[2].scratch : ""}</td>
          <td>{playerGame.scores[2] !== null ? playerGame.scores[2].handicapped : ""}</td>
          <td>totals</td>
          <td>totals</td>
          <td rowSpan={2}>Points</td>
        </tr>
        <tr>
          <td colSpan={2}>{playerGame.scores[0] !== null ? playerGame.scores[0].score : ""}</td>
          <td colSpan={2}>{playerGame.scores[1] !== null ? playerGame.scores[1].score : ""}</td>
          <td colSpan={2}>{playerGame.scores[2] !== null ? playerGame.scores[2].score : ""}</td>
          <td colSpan={2}>totals</td>
        </tr>
        </tbody>
      )
    }
  }


  table() {
    if(this.state.game.playerGames.length !== 8){
      let tables = [];
      if (this.state.game.playerGames.length) {
        for(let i = 0; i< Math.floor(this.state.game.playerGames.length / 3); i++){
          tables.push(
            <React.Fragment key={i + "-empty"}>
              {(this.state.game.playerGames.length === 6 && i !== 0) && <br/>}
              <table key={i} id={this.state.game.teams[i].name.replace(/\s+/g, '-').toLowerCase()}>
                <thead>
                <tr>
                  <th colSpan={10}>{this.state.game.teams[i].name}</th>
                  <th>score</th>
                </tr>
                <tr>
                  <th width="10%">HCP</th>
                  <th width="40%">Bowler</th>
                  <th width="10%" colSpan={2}>Game 1</th>
                  <th width="10%" colSpan={2}>Game 2</th>
                  <th width="10%" colSpan={2}>Game 3</th>
                  <th width="10%" colSpan={2}>Total</th>
                  <th width="10%">Pts</th>
                </tr>
                </thead>
                {this.state.game.playerGames.slice(3 * i, 3 * i + 3).map(playerGame => (
                  this.genScores(playerGame)
                ))}
              </table>
            </React.Fragment>
            )}
      }
      if (! this.state.game.playerGames.length) {
        tables.push(this.addPlayers(0))
      } else if (this.state.game.playerGames.length < 6){
        tables.push(this.addPlayers(1))
      } else if (this.state.game.playerGames.length === 6 && this.state.game.playerGames.every(playerGame => playerGame.scores.length === 3)) {
        tables.push(<Button variant={"raised"} color={"primary"} key={'scoreGame'} id={"scoreGame"} onClick={this.scoreGame}>Score Game</Button>)
      }
      return tables
    } else {
      let tables = [];
      const teamTotals = [this.state.game.playerGames.slice(0, 4).reduce((a, b) => a + b.scores.reduce((a, b) => a + b.score, 0), 0),
      this.state.game.playerGames.slice(4, 8).reduce((a, b) => a + b.scores.reduce((a, b) => a + b.score, 0), 0)];
      for(let i = 0; i<2; i++) {
        tables.push(
          <React.Fragment key={i + "-fragment"}>
            {i !== 0 && <br/>}
            <table key={i} id={this.state.game.teams[i].name.replace(/\s+/g, '-').toLowerCase()} className={teamTotals[i] > teamTotals[(i + 1) % 2] ? "winner" : "loser"}>
              <thead>
              <tr>
                <th colSpan={10}>{this.state.game.teams[i].name}</th>
                <th>{teamTotals[i]}</th>
              </tr>
              <tr>
                <th width="10%">HCP</th>
                <th width="40%">Bowler</th>
                <th width="10%" colSpan={2}>Game 1</th>
                <th width="10%" colSpan={2}>Game 2</th>
                <th width="10%" colSpan={2}>Game 3</th>
                <th width="10%" colSpan={2}>Total</th>
                <th width="10%">Pts</th>
              </tr>
              </thead>
              {this.state.game.playerGames.slice(4 * i, 4 * i + 4).map(playerGame => {
                return Game.genFullScores(playerGame);
              })}
            </table>
          </React.Fragment>);
      }
      return tables;
    }
  }

  render() {
    if(this.state.status === "OK") {
      return (
        <div className="Game">
          <header className="App-header">
            <Link className={"back"} to={"/league/" + this.state.game.league.id}><Button variant={"raised"}>{this.state.game.league.name}</Button></Link>
            <h1 className="App-title-game"> <Link to={"/team/" + this.state.game.teams[0].id}>{this.state.game.teams[0].name}</Link> vs <Link to={"/team/" + this.state.game.teams[1].id}>{this.state.game.teams[1].name}</Link></h1>
            <h3>{new Date(Date.parse(this.state.game.time)).toLocaleString('en-GB', { timeZone: 'UTC' })} at {this.state.game.venue}</h3>
          </header>
          {this.table()}
        </div>
      )
    } else {
      return <CircularProgress color={"primary"} />
    }
  }
}

export default Game;