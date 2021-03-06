import React from 'react';
import { render } from 'react-dom';
import NotificationSystem from 'react-notification-system';

import RaccoonApp from '../RaccoonApp.react';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';
import NotificationStore from '../../stores/NotificationStore';
import AuthStore from '../../stores/AuthStore';
import ActionStore from '../../stores/ActionStore';

import Sidebar from './Sidebar.react';
import Topbar from './../Topbar.react';
import Taskbar from './../Taskbar.react';


class DashboardApp extends React.Component {

    constructor(props, context) {
        super(props, context);
        RaccoonApp.fetchAll();
        this.state = RaccoonApp.getState();
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        AuthStore.addListener(this._onChange);
        ActionStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
        NotificationStore.addListener(this._onChange);
        this._notificationSystem = this.refs.notificationSystem;
    }

    componentWillUnmount() {
        AuthStore.removeListener(this._onChange);
        ActionStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
        NotificationStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = RaccoonApp.getState();
        this.setState(state);

        NotificationStore.display(this._notificationSystem);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <Sidebar
                        projects={this.state.projects}
                        environments={this.state.environments}
                        actions={this.state.actions}
                    />
                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2">
                        <Topbar />
                        <Taskbar />

                        <NotificationSystem ref="notificationSystem" />

                        <div className="content">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default DashboardApp;
