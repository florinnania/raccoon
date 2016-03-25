import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, History } from 'react-router';

import { GridList, GridTile } from 'material-ui';

import RaccoonApp from '../RaccoonApp.react';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';
import AuthStore from '../../stores/AuthStore';
import ActionStore from '../../stores/ActionStore';

import Sidebar from './Sidebar.react.js';
import Topbar from './../Topbar.react.js';
import Taskbar from './../Taskbar.react.js';
import GridItem from './GridItem.react.js';


var DashboardApp = React.createClass({

    getInitialState: function() {
        RaccoonApp.fetchAll();
        return RaccoonApp.getState();
    },

    componentDidMount: function() {
        AuthStore.addListener(this._onChange);
        ActionStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        AuthStore.removeListener(this._onChange);
        ActionStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
    },

    _onChange: function() {
        let state = RaccoonApp.getState();
        this.setState(state);
    },

    /**
    * @return {object}
    */
    render: function() {

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

                        <div className="content">
                            {this.props.children}

                            {

                                this.state.projects.map(project => {
                                    if (project.visible) {
                                        return (
                                            <div className="container-fluid grid-list">
                                                {
                                                    this.state.environments.map(environment => {
                                                        if (environment.visible) {
                                                            return <GridItem project={project}
                                                                             environment={environment}
                                                                    />;
                                                        }
                                                    })
                                                }
                                            </div>
                                        );
                                    }
                                })
                            }

                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

export default DashboardApp;
