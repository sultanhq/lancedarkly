import React, { Component } from "react";
import { VsCodeContext } from "../vs-code-context/index";

export class HandleToggleState extends Component {
  constructor(props) {
    super(props);
    const { envDetails } = props;
    this.env = envDetails._environmentName.toLowerCase();
    this.state = {
      on: envDetails.on
    };
  }

  handleToggleState = () => {
    const { vscode } = this.context;
    const { ldKey } = this.props;
    const { on } = this.state;
    vscode.postMessage({
      name: "confirmToggleState",
      args: [ldKey, this.env, !on]
    });
  };

  componentDidMount() {
    const { vscodeSubscribe } = this.context;
    const { envDetails, ldKey } = this.props;
    vscodeSubscribe(event => {
      const { confirmToggleState } = event.data;
      if (
        confirmToggleState &&
        this.env === confirmToggleState.env &&
        ldKey === confirmToggleState.key
      ) {
        envDetails.on = confirmToggleState.on;
        this.setState({
          on: confirmToggleState.on
        });
      }
    });
  }

  render() {
    const { on } = this.state;
    const { children, envDetails } = this.props;
    return (
      <React.Fragment>
        {children(this.handleToggleState, { envDetails, on })}
      </React.Fragment>
    );
  }
}

HandleToggleState.contextType = VsCodeContext;
