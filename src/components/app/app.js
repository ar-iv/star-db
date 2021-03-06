import React, { Component } from 'react';

import Header from '../header';
import Footer from '../footer';
import RandomPlanet from '../random-planet';
import ErrorBoundry from '../error-boundry';
import SwapiService from '../../services/swapi-service';
import DummySwapiService from '../../services/dummy-swapi-service';

import { StarshipDetails, StarshipList } from '../sw-components';

import { PeoplePage, PlanetsPage, StarshipsPage, SecretPage, LoginPage, ErrorPage } from '../pages';
import { SwapiServiceProvider } from '../swapi-service-context';


import './app.css';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

export default class App extends Component {

  state = {
    swapiService: new SwapiService(),
    isLoggedIn: false
  };

  onLogin = () => {
    this.setState((state) => {
      return {
        isLoggedIn: !state.isLoggedIn
      }
    });
  };

  onServiceChange = () => {
    this.setState(({ swapiService }) => {
      const Service = swapiService instanceof SwapiService ?
                        DummySwapiService : SwapiService;
      return {
        swapiService: new Service()
      };
    });
  };

  render() {

    const { isLoggedIn } = this.state;

    // const Service = swapiService instanceof SwapiService ? DummySwapiService : SwapiService; 

    return (
      <ErrorBoundry>
        <SwapiServiceProvider value={this.state.swapiService} >
          <Router>
            <div className="stardb-app">
              <Header 
                onServiceChange={this.onServiceChange}
                isLoggedIn={isLoggedIn} />

              <RandomPlanet updateInterval={2000}/>

              <Switch>
                <Route path="/" 
                       render={() => <h2>Welcome to StarDB</h2>}
                       exact={true} />
                <Route path="/starships" 
                       component={StarshipsPage}
                       exact />

                <Route path="/people/:id?" 
                       component={PeoplePage}
                       exact />
                <Route path="/planets/" 
                       component={PlanetsPage}
                       exact />
                <Route path="/starships/:id" 
                       render={({ match }) => {
                        const { id } = match.params;
                        return <StarshipDetails itemId={id} />
                       }} />
                <Route path="/secret" 
                       render = {() => (
                        <SecretPage 
                          isLoggedIn={ isLoggedIn } />
                       )}
                       exact />
                <Route path="/login" 
                       render = {() => (
                        <LoginPage 
                          isLoggedIn={ isLoggedIn }
                          onLogin={this.onLogin} />
                       )}
                       exact />

                <Route render={() => <h2>Page not found.</h2>} />
              </Switch>
            </div>
              <Footer />
          </Router>
        </SwapiServiceProvider>
      </ErrorBoundry>
    );
  }
}
