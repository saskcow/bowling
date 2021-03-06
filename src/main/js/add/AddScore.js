import React from 'react';
import axios from 'axios';
import {Button, Checkbox, InputAdornment, TextField} from 'material-ui';

class AddScore extends React.Component{
  constructor(props) {
    super();
    this.state = ({id: props.id, scratch: "", handicap: "", checkHandicap: false});
    this.handleUserInput = this.handleUserInput.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleUserInput (event) {
    this.setState({[event.target.name]: event.target.value});
  }

  submit(event) {
    event.preventDefault();

    axios.post("/api/score", {
      playerGameId: this.state.id,
      scratch: this.state.scratch,
      handicap: this.state.checkHandicap ? this.state.handicap : null
    })
      .then(response => {
        location.reload();
        console.log("created at " + response.headers.location);
      })
      .catch(error => {
        if(error.response && error.response.status === 401){
          window.location.href = '/login';
        } else if(error.response && error.response.status === 400){
          this.setState({err: "Invalid Data"});
        } else {
          console.log(error)
        }
      });
  }

  render() {
    return (
      <div className={this.props.name + "-AddScreen"}>
        <form className={this.props.name + "-theScoreForm"} onSubmit={this.submit} noValidate>

          <TextField
            id={this.props.name + "-scratch"}
            name="scratch"
            label="Scratch"
            fullWidth={true}
            value={this.state.scratch}
            onChange={this.handleUserInput}
            type="number"
            className={"scratch"}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />

          <TextField
            id={this.props.name + "-handicap"}
            name="handicap"
            label="Override handicap"
            fullWidth={true}
            value={this.state.handicap}
            onChange={this.handleUserInput}
            type="number"
            className={"handicap"}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Checkbox
                    checked={this.state.checkHandicap}
                    onChange={this.handleUserInput}
                    name="checkHandicap"
                    id={this.props.name + "-checkHandicap"}
                    value="val"
                    color="primary"
                  />
                </InputAdornment>
              ),
            }}
            margin="normal"
          />

          <br/>

          <Button id={this.props.name + '-submit'} type={"submit"} variant={"raised"} color={"primary"} className={"submitForm"}>Submit</Button>

        </form>
        <p className={"errorMessage"}>{this.state.err}</p>
      </div>
    )
  }
}

export default AddScore;