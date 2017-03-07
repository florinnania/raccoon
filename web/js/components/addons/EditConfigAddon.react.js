import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/yaml';
import 'brace/mode/php';
import 'brace/mode/json';
import 'brace/mode/javascript';
import 'brace/theme/github';
import 'brace/ext/searchbox';

import BaseAddon from './BaseAddon.react';
import SaltStore from '../../stores/SaltStore';
import ActionStore from '../../stores/ActionStore';
import FlowStore from '../../stores/FlowStore';
import JobStore from '../../stores/JobStore';
import InstallStore from '../../stores/InstallStore';
import ConnectorStore from '../../stores/ConnectorStore';
import BuildStore from '../../stores/BuildStore';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';


// Constants used to extract different config files from the config string
let DEFAULT_CONFIG_DELIMITER_START = "##START-DEFAULT-CONFIG##";
let DEFAULT_CONFIG_DELIMITER_END = "##END-DEFAULT-CONFIG##";
let LOCAL_CONFIG_DELIMITER_START = "##START-LOCAL-CONFIG##\n";
let LOCAL_CONFIG_DELIMITER_END = "##END-LOCAL-CONFIG##";


class EditConfigAddon extends BaseAddon {

    constructor(props) {
        super(props);

        this.state = {
            project: this.addon_context.project,
            environment: this.addon_context.environment,
            config: null,
            defaultConfig: '',
            localConfig: '',
            action: ActionStore.getById(this.addon_context.action),
            flow: null,
            job: null,
            install: null,
            build: null,
            branch: null,
            connectorId: null,
            getConfigId: null,
            setConfigId: null,
            result: null,
            syntax: 'yaml'
        };

        this._onChange = this._onChange.bind(this);
        this.onCommandResult = this.onCommandResult.bind(this);
        this.handleConfigChange = this.handleConfigChange.bind(this);

        if (!InstallStore.all) {
            InstallStore.fetchAll();
        }
    }

    /** Add listeners on stores */
    componentDidMount() {
        SaltStore.addListener(this.onCommandResult);

        ActionStore.addListener(this._onChange);
        FlowStore.addListener(this._onChange);
        JobStore.addListener(this._onChange);
        ConnectorStore.addListener(this._onChange);
        InstallStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
        BuildStore.addListener(this._onChange);

        this._onChange();
    }

    /** Remove listeners from stores. */
    componentWillUnmount() {
        SaltStore.removeListener(this.onCommandResult);

        ActionStore.removeListener(this._onChange);
        FlowStore.removeListener(this._onChange);
        JobStore.removeListener(this._onChange);
        ConnectorStore.removeListener(this._onChange);
        InstallStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
        BuildStore.removeListener(this._onChange);
    }

    /**
     * Called when the SaltStore emits a change, that is, when a result has
     * arrived from the backend for an executed command.
     */
    onCommandResult() {
        let config = this.state.config;
        let localConfig = this.state.localConfig;
        let defaultConfig = this.state.defaultConfig;
        let result = this.state.result;

        /*
            If the state config is null, and getConfigId is set,
            SaltStore may contain the config, so we need to get, parse and set
            it on state.
         */
        if (!config && this.state.getConfigId) {
            config = SaltStore.getResult(this.state.getConfigId);

            // Verify if the config arrived.
            if (!config) return null;

            // Split the config by delimiters
            let startDefaultConfig = config.indexOf(DEFAULT_CONFIG_DELIMITER_START) + DEFAULT_CONFIG_DELIMITER_START.length;
            let endDefaultConfig = config.indexOf(DEFAULT_CONFIG_DELIMITER_END);
            defaultConfig = config.substr(
                startDefaultConfig,
                endDefaultConfig - startDefaultConfig
            );

            // Extract the local config string
            let startLocalConfig = config.indexOf(LOCAL_CONFIG_DELIMITER_START) + LOCAL_CONFIG_DELIMITER_START.length;
            let endLocalConfig = config.indexOf(LOCAL_CONFIG_DELIMITER_END);
            localConfig = config.substr(
                startLocalConfig,
                endLocalConfig - startLocalConfig
            );
        }

        // If setConfigId is set, the result may have arrived.
        if (this.state.setConfigId) {
            result = SaltStore.getResult(this.state.setConfigId);
        }

        // Update state
        this.setState({
            config: config,
            localConfig: localConfig,
            defaultConfig: defaultConfig,
            result: result
        })
    }

    /**
     * Get config by running the command "oeconfig2.getconfig".
     *
     * @param {string} project: project name
     * @param {string} env: environment name
     * @param {string} branch: branch
     * @param {string} connectorId: connector primary key value
     * @returns {null}
     */
    getConfig(project, env, branch, connectorId) {
        // Do nothing if a command has been registered for getConfig already.
        if (this.state.getConfigId) {
            return null;
        }
        else {
            // Run the command and update state
            let getConfigId = SaltStore.runCommand(
                'oeconfig2.getconfig',
                {
                    service_type: project,
                    target_env: env,
                    git_branch: branch,
                    connectorId: connectorId
                }
            );
            this.setState({getConfigId: getConfigId});
        }
    }

    /**
     * Set config by running the command "oeconfig2.setconfig".
     *
     * @param {boolean} restart: Set true to restart after config is set.
     * @returns {null}
     */
    setConfig(restart) {
        // Do nothing if a command has been registered for setConfig already.
        if (this.state.setConfigId) {
            return null;
        }
        else {
            // Add a new line at the end of the local config
            let localConfig = this.state.localConfig;
            if (localConfig[localConfig.length - 1] != "\n") {
                localConfig = "\n";
            }
            // Run the command and update state
            let signal = 1; // update only
            if (restart) {
                signal = 15; // restart
            }

            let setConfigId = SaltStore.runCommand(
                'oeconfig2.setconfig',
                {
                    service_type: this.state.project.name,
                    target_env: this.state.environment.name,
                    git_branch: this.state.branch,
                    config_data: localConfig,
                    connectorId: this.state.job.connector,
                    signal: signal
                }
            );
            this.setState({setConfigId: setConfigId});
        }
    }

    /**
     * Called when other stores update.
     * Fetches all needed data and executes getConfig.
     * @private
     */
    _onChange() {
        let action = ActionStore.getById(this.addon_context.action);

        let flow = FlowStore.getById(action.flow);
        let job = JobStore.getById(flow.job);

        let connectorId = job.connector;

        let install = InstallStore.getLatestInstall(
            this.addon_context.project,
            this.addon_context.environment
        );
        let build = install ? BuildStore.getById(install.build) : this.state.build;

        let branch = this.state.branch;
        if (build && !branch && !this.state.getConfigId) {
            branch = build.branch;
            // Get config since all necessary parameters are set
            this.getConfig(
                this.addon_context.project.name,
                this.addon_context.environment.name,
                branch,
                connectorId
            );
        }

        // Update state
        this.setState({
            action: action,
            flow: flow,
            job: job,
            install: install,
            build: build,
            branch: branch,
            connectorId: connectorId,
        });
    }

    /**
     * Updates the local config state each time a change is made.
     * @param newValue Current value of local config
     */
    handleConfigChange(newValue) {
        this.setState({localConfig: newValue});
    }

    /**
     * Updates the language highlighting
     */
    handleSyntaxChange(event) {
        this.setState({syntax: event.target.value});
    }

    render() {
        // Loading
        if (!this.state.config) {
            return (<div>Loading config...</div>);
        }

        // Create the post-save elements
        if (this.state.setConfigId) {
            let displayResult = (<h3>Saving config...</h3>);
            if (this.state.result) {
                displayResult = (
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <h3>Config saved!</h3>
                        <div className="well well-sm">
                            {
                                this.state.result.split("\n").map((item, idx) => {
                                    /*
                                     replace [URL]...[/URL] lines with links.
                                     TODO: this isn't generic at all, we should probably replace urls directly.
                                     */
                                    if (item.includes("[URL]")) {
                                        item = item.replace(/\[\/?URL]/g, '');
                                        item = (<a href={item}>{item}</a>);
                                    }
                                    return (
                                        <span key={"console-line-" + idx} style={{"fontSize": "12px", "fontFamily": "Courier"}}>
                                        {item}
                                            <br/>
                                    </span>
                                    );
                                })
                            }
                        </div>
                    </div>
                );
            }
            return (
                <div className="container-fluid">
                    <div className="row">
                        {displayResult}
                    </div>
                </div>
            );
        }

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-11 col-md-11 col-lg-11">
                        <h3>{"Configure " + this.state.project.label + " on " + this.state.environment.name.toUpperCase()}</h3>
                    </div>
                    <div className="col-sm-1 col-md-1 col-lg-1">
                        <div className="form-group">
                            <label htmlFor="code-syntax" className="control-label">Syntax:</label>
                            <select className="form-control" id="code-syntax" onChange={this.handleSyntaxChange.bind(this)}>
                                <option value="yaml">yaml</option>
                                <option value="json">json</option>
                                <option value="php">php</option>
                                <option value="javascript">javascript</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <AceEditor
                            name="default-config"
                            theme="github"
                            mode={this.state.syntax}
                            fontSize={12}
                            enableBasicAutocompletion={true}
                            enableLiveAutocompletion={true}
                            width="100%"
                            minLines={20}
                            maxLines={50}
                            readOnly={true}
                            value={this.state.defaultConfig}
                            editorProps={{$blockScrolling: Infinity}}
                        />
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <AceEditor
                            name="local-config"
                            theme="github"
                            mode={this.state.syntax}
                            fontSize={12}
                            enableBasicAutocompletion={true}
                            enableLiveAutocompletion={true}
                            width="100%"
                            minLines={20}
                            maxLines={50}
                            onChange={this.handleConfigChange}
                            value={this.state.localConfig}
                            editorProps={{$blockScrolling: Infinity}}
                        />
                    </div>
                </div>
                <br/>
                <div className="row">
                    <button type="button" className={"btn btn-success"} aria-label="Save" onClick={this.setConfig.bind(this, false)}>Save</button>
                    &nbsp;&nbsp;
                    <button type="button" className={"btn btn-warning"} aria-label="Save&Restart" onClick={this.setConfig.bind(this, true)}>Save & Restart</button>
                </div>
            </div>
        )
    }
}

export default EditConfigAddon;
