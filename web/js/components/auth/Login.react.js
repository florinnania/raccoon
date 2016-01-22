import React from 'react'
import { History } from 'react-router';

import RaccoonApp from '../RaccoonApp.react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import AuthStore from '../../stores/AuthStore';
import NotificationStore from '../../stores/NotificationStore';


import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;

function getLocalState() {
    let localState = {
        username: '',
        password: '',
        error: null
    };

    return RaccoonApp.getState(localState);
}

let Login = React.createClass({
    mixins: [ History ],

    getInitialState: function () {
        return getLocalState();
    },

    login: function (event) {
        event.preventDefault();
        AppDispatcher.dispatch({
            action: ActionTypes.LOGIN_USER,
            data: this.state,
        });
    },

    componentDidMount: function() {
        AuthStore.addListener(this._onChange);
        NotificationStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        AuthStore.removeListener(this._onChange);
        NotificationStore.removeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getLocalState());

        if (AuthStore.isLoggedIn()) {
            RaccoonApp.fetchAll(); // fetch all everything at login
            this.history.pushState(null, '/');
        }
    },

    _onUsernameChange: function (event) {
        this.state.username = event.target.value;
        this.setState(this.state);
    },

    _onPasswordChange: function (event) {
        this.state.password = event.target.value;
        this.setState(this.state);
    },

    render: function () {
        let error_message = '';

        if (!!this.state.notifications && this.state.notifications.length > 0) {
            let notification = this.state.notifications.pop();
            error_message = (
                <div className="alert alert-danger col-sm-4" role="alert">
                    {notification.message}
                </div>
            );
            console.log('error saasd');
        }

        return (

            <div className="row">
                <div className="col-sm-offset-4">
                    <div className="container">
                        {error_message}
                    </div>
                    <div className="container">

                        <h3>Sign In</h3>
                        <form onSubmit={this.login} className="form-horizontal col-sm-4">
                            <div className="form-group">
                                <label htmlFor="username" className="control-label">Username or Email</label>
                                <input type="text" value={this.state.username} className="form-control"
                                       onChange={this._onUsernameChange}
                                       id="username" placeholder="Username or Email"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="control-label">Password</label>
                                <input type="password" value={this.state.password} className="form-control"
                                       onChange={this._onPasswordChange}
                                       id="password" placeholder="Password"/>
                            </div>
                            <div className="form-group">
                                <a href="/#/register">Not registered yet?</a>
                                <input type="submit" value="Sign In" className="btn btn-info pull-right"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

export default Login;
