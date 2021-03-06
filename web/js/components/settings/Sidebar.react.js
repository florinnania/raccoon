import React from 'react';
import { Link } from 'react-router';

import UserProfile from './../UserProfile.react.js';
import MenuItem from './../MenuItem.react.js';
import Utils from '../../utils/Utils';

import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


class Sidebar extends React.Component {
    render() {
        return (
            <div className="col-sm-3 col-md-2 sidebar">
                <ul className="nav nav-sidebar" style={{height: 115 + 'px'}}>
                    <UserProfile />
                </ul>
                <div style={{ height: 100 + '%' }}>
                    <ul className="nav nav-sidebar" style={{ height: 100 + '%', overflow: 'auto' }}>
                        <li className="active">
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseProjects" aria-expanded="false" aria-controls="collapseProjects">
                                Projects <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseProjects" className="collapse in">
                                <ul className="nav nav-submenu">
                                    {
                                        Utils.sortItems(this.props.projects).map(project => {
                                            return <MenuItem key={project.id} item={project} link={"/settings/project/" + project.id} />;
                                        })
                                    }
                                    <li>
                                        <Link to="/settings/project/new">
                                            <i className="fa fa-plus" /> Add new
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/settings/order/projects">
                                            <i className="fa fa-arrows" /> Set order
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseEnvironments" aria-expanded="false" aria-controls="collapseEnvironments">
                                Environments <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseEnvironments" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        Utils.sortItems(this.props.environments).map(environment => {
                                            return <MenuItem key={environment.id} item={environment} link={"/settings/environment/" + environment.id} />;
                                        })
                                    }
                                    <li>
                                        <Link to="/settings/environment/new">
                                            <i className="fa fa-plus" /> Add new
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/settings/order/environments">
                                            <i className="fa fa-arrows" /> Set order
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseJobs" aria-expanded="false" aria-controls="collapseJobs">
                                Jobs <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseJobs" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.jobs.sort((a, b) => {
                                            if(a.name < b.name) return -1;
                                            if(a.name > b.name) return 1;
                                            return 0;
                                        }).map(job => {
                                            return <MenuItem key={job.id} item={job} link={"/settings/job/" + job.id} />;
                                        })
                                    }
                                    <li>
                                        <Link to="/settings/job/new">
                                            <i className="fa fa-plus" /> Add new
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseFlows" aria-expanded="false" aria-controls="collapseFlows">
                                Flows <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseFlows" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.flows.sort((a, b) => {
                                            if(a.name < b.name) return -1;
                                            if(a.name > b.name) return 1;
                                            return 0;
                                        }).map(flow => {
                                            return <MenuItem key={flow.id} item={flow} link={"/settings/flow/" + flow.id} />;
                                        })
                                    }
                                    <li>
                                        <Link to="/settings/flow/new">
                                            <i className="fa fa-plus" /> Add new
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseActions" aria-expanded="false" aria-controls="collapseActions">
                                Actions <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseActions" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.actions.sort((a, b) => {
                                            if(a.label < b.label) return -1;
                                            if(a.label > b.label) return 1;
                                            return 0;
                                        }).map(action => {
                                            return <MenuItem key={action.id} item={action} link={"/settings/action/" + action.id} />;
                                        })
                                    }
                                    <li>
                                        <Link to="/settings/action/new">
                                            <i className="fa fa-plus" /> Add new
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseConnectors" aria-expanded="false" aria-controls="collapseConnectors">
                                Connectors <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseConnectors" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.connectors.sort((a, b) => {
                                            if(a.name < b.name) return -1;
                                            if(a.name > b.name) return 1;
                                            return 0;
                                        }).map(connector => {
                                            return <MenuItem key={connector.id} item={connector} link={"/settings/connector/" + connector.id} />;
                                        })
                                    }
                                    <li>
                                        <Link to="/settings/connector/new">
                                            <i className="fa fa-plus" /> Add new
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseUsers" aria-expanded="false" aria-controls="collapseUsers">
                                Users <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseUsers" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.users.sort((a, b) => {
                                            if(a.name < b.name) return -1;
                                            if(a.name > b.name) return 1;
                                            return 0;
                                        }).map(user => {
                                            return <MenuItem key={user.id} item={user} link={"/settings/user/" + user.id} />;
                                        })
                                    }
                                </ul>
                            </div>
                        </li>
                        <li>
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseRights" aria-expanded="false" aria-controls="collapseRights">
                                Rights <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseRights" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.rights.map(right => {
                                            return <MenuItem key={right.id} item={right} link={"/settings/right/" + right.id} />;
                                        })
                                    }
                                    <li>
                                        <a href="/settings/right/new">
                                            <i className="fa fa-plus" /> Add new
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Sidebar;
