import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './index.css';
import Index from './components/Index';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Index} />
      </Switch>
    </Router>
  );
}
