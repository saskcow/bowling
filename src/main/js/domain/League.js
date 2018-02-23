import React from 'react';
import axios from "axios/index";
import TeamSummary from "../summary/TeamSummary";
import {Button, CircularProgress} from "material-ui";
import {Link} from "react-router-dom";
import GameSummary from "../summary/GameSummary";

class League extends React.Component {

  constructor(props) {
    super();
    this.state = {status: "Loading"};
    this.getLeague = this.getLeague.bind(this);
    this.getLeague(props.match.params.id);
  }

  getLeague(id) {
    axios.get('/api/league/' + id)
      .then(response => {
        this.setState({
          status: "OK",
          id: id,
          name: response.data.name,
          teams: response.data.teams,
          games: response.data.games
        })
      })
      .catch(error => {
        if (error.response) {
          this.setState({status: "error", err: error.response.data});
        } else if (error.request) {
          this.setState({status: "error", err: "No Response"});
          console.log(error.request);
        } else {
          this.setState({status: "error", err: "Error with Request"});
          console.log('Error', error.message);
        }
      });
  }

  render() {
    if(this.state.status === "OK") {
      return (
        <div className={'League'}>

          <h2>{this.state.name}</h2>
          <Link to={"/league"}>Back</Link>

          <h3>Teams</h3>
          <ul className={"Teams"}>
            {this.state.teams.map(team => (
              <TeamSummary key={team.id} id={team.id}>{team.name}</TeamSummary>
            ))}
          </ul>
          <Link to={"/league/" + this.state.id + '/add-team'}><Button className={"addTeam"} variant={"raised"} color={"primary"}>Add A Team</Button></Link>

          <h3>Games</h3>
          <ul className={"Games"}>
            {this.state.games.map(game => (
              <GameSummary key={game.id} id={game.id} time={game.time} teams={game.teams}>{game.venue}</GameSummary>
            ))}
          </ul>
          <Link to={"/league/" + this.state.id + '/add-game'}><Button className={"addGame"} variant={"raised"} color={"primary"}>Add A Game</Button></Link>

        </div>
      )
    } else if (this.state.status === "error") {
      return (
        <h2>{this.state.err}</h2>
      )
    } else {
      return <CircularProgress color={"primary"} />
    }
  }
}

export default League;