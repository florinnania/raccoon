import React from 'react'
import TimeAgo from 'react-timeago'

// stores
import ProjectStore from '../stores/ProjectStore';

import RaccoonApp from './RaccoonApp.react';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Utils from '../utils/Utils';


export const READY_STATES = new Set(['FAILURE', 'REVOKED', 'SUCCESS']);
export const UNREADY_STATES = new Set(['PENDING', 'RECEIVED', 'RETRY', 'STARTED']);

function getLocalState(projectId) {
    let localState = {
        local: {
            project: ProjectStore.getById(projectId)
        }
    };

    return RaccoonApp.getState(localState)
}

export class TaskItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = getLocalState(this.props.data.context.project_id);
        this._onChange = this._onChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        ProjectStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        ProjectStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = getLocalState(this.props.data.context.project_id);
        this.setState(state);
    }

    handleCancel() {
        let build_number = this.props.data.response ? this.props.data.response.number : null;
        if (build_number) {
            AppDispatcher.dispatch({
                action: this.props.data.connector_type,
                data: {
                    method: 'stop',
                    args: {
                        id: this.props.data.id,
                        job: this.props.data.job,
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
        if (UNREADY_STATES.has(data.status)) {
            progressBar = (
                <div className="materialize-progress">
                    <div className={data.status == 'PENDING' ? 'indeterminate' : 'determinate'} style={progressStyle}/>
                </div>
            );
        }

        // cancel button
        let cancelButton;
        let build_number = data.response ? data.response.number : null;
        if (
            build_number &&
            data.status != 'PENDING' &&
            data.user == this.state.user.id &&
            UNREADY_STATES.has(data.status)
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

        return (
            <div className={`list-group-item ${taskClass}`}>
                <div className="list-group-item-heading">
                    <span className="title">
                        {this.state.local.project.label || this.state.local.project.name}
                    </span>
                    { cancelButton }
                </div>
                <p className="list-group-item-text">
                    { data.context.branch }<br />
                    { data.status }
                    <span className="time pull-right">
                        <TimeAgo
                            date={data.date_added * 1000}
                            minPeriod={60}
                            formatter={Utils.timeAgoFormatter}
                            />
                    </span>
                </p>

                { progressBar }
            </div>
        );
    }
}
