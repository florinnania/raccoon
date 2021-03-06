import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import ActionStore from '../stores/ActionStore';
import AuthStore from '../stores/AuthStore';
import AuditlogStore from '../stores/AuditlogStore';
import EnvironmentStore from '../stores/EnvironmentStore';
import ProjectStore from '../stores/ProjectStore';
import NotificationStore from '../stores/NotificationStore';
import FlowStore from '../stores/FlowStore';
import BuildStore from '../stores/BuildStore';
import InstallStore from '../stores/InstallStore';
import RightStore from '../stores/RightStore'

import DashboardApp from './dashboard/DashboardApp.react';
import Login from './auth/Login.react';
import Logout from './auth/Logout.react';
import NotFound from './NotFound.react';
import SettingsApp from './settings/SettingsApp.react';
import Register from './auth/Register.react';
import Flow from './dashboard/Flow.react';
import CardsView from './dashboard/CardsView.react';
import TaskView from './TaskView.react';

import ActionForm from './settings/ActionForm.react';
import ActionUpdateForm from './settings/ActionUpdateForm.react';
import ConnectorForm from './settings/ConnectorForm.react';
import ConnectorUpdateForm from './settings/ConnectorUpdateForm.react';
import EnvironmentForm from './settings/EnvironmentForm.react';
import EnvironmentUpdateForm from './settings/EnvironmentUpdateForm.react';
import ProjectForm from './settings/ProjectForm.react';
import ProjectUpdateForm from './settings/ProjectUpdateForm.react';
import JobForm from './settings/JobForm.react.js';
import JobUpdateForm from './settings/JobUpdateForm.react.js';
import FlowForm from './settings/FlowForm.react';
import FlowUpdateForm from './settings/FlowUpdateForm.react';
import SetOrderWrapper from './settings/SetOrderWrapper.react';
import RightForm from './settings/RightForm.react'
import RightUpdateForm from './settings/RightUpdateForm.react'
import UserUpdateForm from './settings/UserUpdateForm.react'


import Addons from "./addons/Addons";

function getRaccoonState() {
    return {
        projects: ProjectStore.all,
        environments: EnvironmentStore.all,
        actions: ActionStore.all,
        user: AuthStore.me,
        notifications: NotificationStore.all,
        flows: FlowStore.all,
        addons: Addons.all,
        rights: RightStore.all
    };
}

class RaccoonApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Middleware that checks if user is authenticated; if not redirect to /login
     */
    requireAuth(nextState, replaceState, callback) {
        if (!AuthStore.isLoggedIn()) {
            replaceState({nextPathname: nextState.location.pathname}, '/login');
        }

        callback();
    }

    /**
     * Middleware that checks if user is admin; if not redirect to /login
     */
    requireAdmin(nextState, replaceState, callback) {
        if (AuthStore.role != 'admin') {
            replaceState({nextPathname: nextState.location.pathname}, '/login');
        }

        callback();
    }

    static getState(state) {
        var globalState = getRaccoonState();

        state = state || {};

        for (var key in state) {
            globalState[key] = state[key];
        }

        return globalState;
    }

    static getBrowserState() {
        var state = JSON.parse(localStorage.getItem('state'));

        if (!state) {
            state = {
                toggle: {
                    project: {},
                    environment: {}
                }
            };
            localStorage.setItem('state', JSON.stringify(state));
        }

        return state;
    }

    static saveBrowserState(state) {
        localStorage.setItem('state', JSON.stringify(state));
    }

    static fetchAll() {
        AuthStore.fetchMe();
        ProjectStore.fetchAll();
        EnvironmentStore.fetchAll();
        ActionStore.fetchAll();
        FlowStore.fetchAll();
    }

    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/settings" component={SettingsApp} onEnter={this.requireAdmin}>
                    <Route path="action/new" component={ActionForm} onEnter={this.requireAuth} />
                    <Route path="action/:id" component={ActionUpdateForm} onEnter={this.requireAuth} />
                    <Route path="connector/new" component={ConnectorForm} onEnter={this.requireAuth} />
                    <Route path="connector/:id" component={ConnectorUpdateForm} onEnter={this.requireAuth} />
                    <Route path="environment/new" component={EnvironmentForm} onEnter={this.requireAuth} />
                    <Route path="environment/:id" component={EnvironmentUpdateForm} onEnter={this.requireAuth} />
                    <Route path="job/new" component={JobForm} onEnter={this.requireAuth} />
                    <Route path="job/:id" component={JobUpdateForm} onEnter={this.requireAuth} />
                    <Route path="project/new" component={ProjectForm} onEnter={this.requireAuth} />
                    <Route path="project/:id" component={ProjectUpdateForm} onEnter={this.requireAuth} />
                    <Route path="flow/new" component={FlowForm} onEnter={this.requireAuth} />
                    <Route path="flow/:id" component={FlowUpdateForm} onEnter={this.requireAuth} />
                    <Route path="order/:elemType" component={SetOrderWrapper} onEnter={this.requireAuth} />
                    <Route path="right/new" component={RightForm} onEnter={this.requireAuth} />
                    <Route path="right/:id" component={RightUpdateForm} onEnter={this.requireAuth} />
                    <Route path="user/:id" component={UserUpdateForm} onEnter={this.requireAuth} />
                </Route>
                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} />
                <Route path="/register" component={Register} />
                <Route path="/" component={DashboardApp} onEnter={this.requireAuth}>
                    <IndexRoute component={CardsView} />
                    <Route path="action/:id/card/:project/:env" component={Flow} onEnter={this.requireAuth} />
                    <Route path="action/:id/project/:project" component={Flow} onEnter={this.requireAuth} />
                    <Route path="action/:id/env/:env" component={Flow} onEnter={this.requireAuth} />
                    <Route path="action/:id" component={Flow} onEnter={this.requireAuth} />
                    <Route path="task/:id" component={TaskView} onEnter={this.requireAuth} />
                </Route>
                <Route path="*" component={NotFound} />
            </Router>
        );
    }
}

export default RaccoonApp;
