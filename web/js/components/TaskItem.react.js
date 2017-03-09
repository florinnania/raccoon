import React from 'react'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router';

// stores
import ProjectStore from '../stores/ProjectStore';
import EnvironmentStore from '../stores/EnvironmentStore';

import RaccoonApp from './RaccoonApp.react';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Utils from '../utils/Utils';
import {TASK_READY_STATES, TASK_UNREADY_STATES} from '../constants/Constants';


function getLocalState(projectId, envId) {
    let localState = {
        local: {
            project: ProjectStore.getById(projectId),
            environment: null
        }
    };

    if (envId) {
        let env = EnvironmentStore.getById(envId);
        localState['local']['environment'] = env.name;
    }

    return RaccoonApp.getState(localState)
}

export class TaskItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = getLocalState(this.props.data.context.project_id, this.props.data.environment);

        this._onChange = this._onChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    _onChange() {
        let state = getLocalState(this.props.data.context.project_id, this.props.data.environment);
        this.setState(state);
    }

    handleCancel() {
        let build_number = this.props.data.result ? this.props.data.result.number : null;
        if (build_number) {
            AppDispatcher.dispatch({
                action: this.props.data.connector_type,
                data: {
                    method: 'stop',
                    args: {
                        id: this.props.data.id,
                        job_id: this.props.data.job,
                        build_number: build_number
                    }
                }
            });
        }
    }

    render() {
        if (!this.state.local.project || !this.state.user) {
            // loading
            return <div></div>;
        }

        let data = this.props.data;
        let now = new Date().getTime();
        let started_at = data.started_at || 0;
        let estimated_duration = data.estimated_duration || 0;
        let duration = now - started_at;
        let progress = data.status == 'SUCCESS' ? 100 : Math.round(duration * 100 / estimated_duration);

        // progress bar
        let progressBar;
        let progressStyle = {width: progress + '%'};
        if (TASK_UNREADY_STATES.has(data.status)) {
            progressBar = (
                <div className="materialize-progress">
                    <div className={data.status == 'PENDING' ? 'indeterminate' : 'determinate'} style={progressStyle}/>
                </div>
            );
        }

        // cancel button
        let cancelButton;
        let build_number = data.result ? data.result.number : null;
        if (
            build_number &&
            data.status != 'PENDING' &&
            data.user == this.state.user.id &&
            TASK_UNREADY_STATES.has(data.status)
        ) {
            cancelButton = (
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCancel}>
                    <span aria-hidden="true">Cancel</span>
                </button>
            );
        }

        // add gray style to old tasks
        let taskClass = '';
        if (now - data.date_added * 1000 > 3600000 * 3) {
            taskClass = 'old';
        }

        let task_date = new Date();

        let taskTitle = this.state.local.project.label || this.state.local.project.name;
        if (this.state.local.environment) {
            taskTitle += " > " + this.state.local.environment;
        }

        return (
            <Link to={this.props.link} className="dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                <div className={`list-group-item ${taskClass}`}>
                    <div className="list-group-item-heading">
                        <span className="title">
                            {taskTitle}
                        </span>
                        { cancelButton }
                    </div>
                    <p className="list-group-item-text">
                        { data.context.branch }<br />
                        { data.status }
                        <span className="time pull-right">
                            <TimeAgo
                                date={data.date_added * 1000 - (task_date.getTimezoneOffset() * 60000)}
                                minPeriod={60}
                                formatter={Utils.timeAgoFormatter}
                                />
                        </span>
                    </p>
                    { progressBar }
                </div>
            </Link>
        );
    }
}
