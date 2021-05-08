import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import AuthGuard from './Hoc/Auth';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/header_footer/Header';
import Footer from './components/header_footer/Footer';
import Home from './components/home';
import SignIn from './components/Signin';

import Dashboard from './components/Admin/Dashboard';
import AdminPlayers from './components/Admin/players';
import AddEditPlayers from './components/Admin/players/AddEditPlayers';

const Routes = ({ user }) => {
  return (
    <Router>
      <Header user={user} />
      <Switch>
        <Route
          path="/admin_players/edit_player/:playerid"
          exact
          component={AuthGuard(AddEditPlayers)}
        />
        <Route
          path="/admin_players/add_player"
          exact
          component={AuthGuard(AddEditPlayers)}
        />
        <Route
          path="/admin_players"
          exact
          component={AuthGuard(AdminPlayers)}
        />
        <Route path="/dashboard" exact component={AuthGuard(Dashboard)} />
        <Route
          path="/sign_in"
          exact
          component={props => <SignIn {...props} user={user} />}
        />
        <Route path="/" exact component={Home} />
      </Switch>
      <ToastContainer />
      <Footer />
    </Router>
  );
};

export default Routes;
