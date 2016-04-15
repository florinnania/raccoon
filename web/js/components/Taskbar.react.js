import React from 'react';

import TaskItem from './TaskItem.react';


var Taskbar = React.createClass({

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {
    },

    componentWillUnmount: function () {

    },

    _onChange: function () {

    },

    render: function () {
        return (
            <nav className="slidemenu slidemenu-vertical slidemenu-right" id="taskbar">
                {/* show tabs */}
                <ul className="nav nav-tabs" role="tablist">
                    <li role="presentation" className="active"><a href="#taskbar-running" aria-controls="running" role="tab" data-toggle="tab">Running</a></li>
                    <li role="presentation"><a href="#taskbar-history" aria-controls="history" role="tab" data-toggle="tab">History</a></li>
                </ul>

                <div className="tab-content">
                    <div role="tabpanel" className="tab-pane active" id="taskbar-running">
                        <div className="list-group">
                            <TaskItem title="Applogic" />
                        </div>
                    </div>
                    <div role="tabpanel" className="tab-pane" id="taskbar-history">
                        <p>Nothing to show here.</p>
                    </div>
                </div>
            </nav>
        );
    }
});

export default Taskbar;
