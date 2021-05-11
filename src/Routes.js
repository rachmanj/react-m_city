import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import AuthGuard from './Hoc/Auth';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/header_footer/Header';
import Footer from './components/header_footer/Footer';
import Home from './components/home';
import SignIn from './components/Signin';
import TheTeam from './components/theTeam';
import TheMatches from './components/theMatches';

import Dashboard from './components/Admin/Dashboard';
import AdminPlayers from './components/Admin/players';
import AddEditPlayers from './components/Admin/players/AddEditPlayers';
import AdminMatches from './components/Admin/matches';
import AddEditMatch from './components/Admin/matches/AddEditMatch';

const Routes = ({ user }) => {
  return (
    <Router>
      <Header user={user} />
      <Switch>
        <Route
          path="/admin_matches/edit_match/:matchid"
          exact
          component={AuthGuard(AddEditMatch)}
        />
        <Route
          path="/admin_matches/add_match"
          exact
          component={AuthGuard(AddEditMatch)}
        />
        <Route
          path="/admin_matches"
          exact
          component={AuthGuard(AdminMatches)}
        />
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
        <Route path="/the_matches" exact component={TheMatches} />
        <Route path="/the_team" exact component={TheTeam} />
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
