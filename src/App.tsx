import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import BlocklyComponent from "./blocklyComponent/blocklyComponent";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AccountLogin from "./login/accountLogin";


function App() {
  return (
<Router>
      <Switch>
          <Route exact path="/" component={AccountLogin}/>
        <Route exact path="/blockly-home"
          component={BlocklyComponent} />
      </Switch>
    </Router>
  );
}

export default App;
