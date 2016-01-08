import React from 'react';
import { Router, Route } from 'react-router';

import AuthStore from '../stores/AuthStore';
import ProjectStore from '../stores/ProjectStore';
import EnvironmentStore from '../stores/EnvironmentStore';
import ActionStore from '../stores/ActionStore';

import NotFound from './NotFound.react';
import DashboardApp from './dashboard/DashboardApp.react';
import SettingsApp from './settings/SettingsApp.react';
import Login from './auth/Login.react';
import Logout from './auth/Logout.react';
import Register from './auth/Register.react';
import Project from './settings/Project.react';


function getRaccoonState() {
    return {
        allProjects: ProjectStore.all,
        allEnvironments: EnvironmentStore.all,
        actions: ActionStore.all,
        user: AuthStore.me,
    };
}

let RaccoonApp = React.createClass({

    getInitialState: function () {
        console.log('Raccoon app, initial state');

        RaccoonApp.fetchAll();

        return {};
    },

    /**
     * Middleware that checks if user is authenticated; if not redirect to /login
     * @param nextState
     * @param replaceState
     * @param callback
     */
    requireAuth: function (nextState, replaceState, callback) {
        if (!AuthStore.isLoggedIn()) {
            replaceState({nextPathname: nextState.location.pathname}, '/login');
        }

        callback();
    },

    /**
    * @return {object}
    */
    render: function () {
        return (
            <Router>
                <Route path="/" component={DashboardApp} onEnter={this.requireAuth} />
                <Route path="/settings" component={SettingsApp} onEnter={this.requireAuth}>
                    <Route path="project/:id" component={Project} onEnter={this.requireAuth} />
                </Route>
                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} />
                <Route path="/register" component={Register} />
                <Route path="*" component={NotFound} />
            </Router>
        );
    },

});


/**
 * Updates the state passed with the global state
 * @param state [Object]
 * @returns {*|{}}
 */
RaccoonApp.getState = function (state) {
    var globalState = getRaccoonState();
    state = state || {};

    for (var key in state) {
        if (state.hasOwnProperty(key)) {
            globalState[key] = state[key];
        }
    }

    return globalState;
};

/**
 * Fetches the global data
 */
RaccoonApp.fetchAll = function () {
    AuthStore.fetchMe();
    ProjectStore.fetchAll();
    EnvironmentStore.fetchAll();
    ActionStore.fetchAll();
};



export default RaccoonApp;
