import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import Header from './components/header_footer/Header';
import Footer from './components/header_footer/Footer';
import Home from './components/home';

const Routes = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default Routes;
