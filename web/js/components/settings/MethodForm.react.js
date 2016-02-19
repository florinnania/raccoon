import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import MethodStore from '../../stores/MethodStore';
import ConnectorStore from '../../stores/ConnectorStore';
import RaccoonApp from '../RaccoonApp.react';
import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;
let argRows = [];

function getLocalState() {
    let localState = {
        connectors: ConnectorStore.all,
        method: {
            name: '',
            connector: null,
            method: '',
            arguments: [{
              'name': '',
              'value': ''
            }]
        }
    };
    return localState;
}


class MethodForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New method';
        this.state = getLocalState();
    }

    componentDidMount() {
        MethodStore.addListener(this._onChange.bind(this));
        ConnectorStore.addListener(this._onChange.bind(this));
    }

    componentWillUnmount() {
        MethodStore.removeListener(this._onChange.bind(this));
        ConnectorStore.removeListener(this._onChange.bind(this));
    }

    _onChange() {
        let state = getLocalState();
        state.method = this.state.method;
        this.setState(state);
    }

    _onChangeName(event) {
        this.state.method.name = event.target.value;
        this.setState({
            method: this.state.method
        });
    }

    _onChangeConnector(event) {
        this.state.method.connector = event.target.value;
        this.setState({
            method: this.state.method
        });
    }

    _onChangeMethod(event) {
        this.state.method.method = event.target.value;
        this.setState({
            method: this.state.method
        });
    }

    _onChangeArgumentName(event) {
        if (typeof(this.state.method.arguments) == 'string'){
          this.state.method.arguments = JSON.parse(this.state.method.arguments)
        }
        this.state.method.arguments[event.target.getAttribute('data-id')]['name'] = event.target.value;
        this.setState({
            method: this.state.method
        });
    }

    _onChangeArgumentValue(event) {
        if (typeof(this.state.method.arguments) == 'string'){
          this.state.method.arguments = JSON.parse(this.state.method.arguments)
        }
        this.state.method.arguments[event.target.getAttribute('data-id')]['value'] = event.target.value;
        this.setState({
            method: this.state.method
        });
    }

    _getDataForRender() {
        return this.state.method;
    }

    onSubmit(event) {
        event.preventDefault();
        AppDispatcher.dispatch({
            action: ActionTypes.CREATE_METHOD,
            data: {
                name: this.state.method.name,
                connector: this.state.method.connector,
                method: this.state.method.method,
                arguments: this.state.method.arguments
            }
        });
    }

    addInput(dataId){
      argRows.push(
        <div className="form-group">
          <input type="text" className="form-control" data-id={dataId} onChange={this._onChangeArgumentName.bind(this)} id="method-arguments-name"
            placeholder="name"/>
          <input type="text" className="form-control" data-id={dataId} onChange={this._onChangeArgumentValue.bind(this)} id="method-arguments-value"
            placeholder="value"/>
        </div>);
     }


    render() {
        let method = this._getDataForRender();
        let name = method.name;
        let connectorId = method.connector;
        let meth = method.method;
        let args = method.arguments;
        if (typeof(args) == "string") {
            args = JSON.parse(args);
        }
        console.log("1111111111111111", args.length);
        if (args.length == 0) {
          argRows.push(
            <div className="form-group">
              <input type="text" className="form-control" data-id='0' onChange={this._onChangeArgumentName.bind(this)} onClick={this.addInput(1)}
                id="method-arguments-name" placeholder="name"/>
              <input type="text" className="form-control" data-id='0' onChange={this._onChangeArgumentValue.bind(this)} id="method-arguments-value"
                placeholder="value"/>
            </div>);
        }else{
          for (var i = 0; i < args.length; i++) {
            argRows.push(
              <div className="form-group">
                <input type="text" className="form-control" data-id={i} onChange={this._onChangeArgumentName.bind(this)} onClick={this.addInput(i+1)}
                  id="method-arguments-name" value={args[i]["name"]} placeholder="name"/>
                <input type="text" className="form-control" data-id={i} onChange={this._onChangeArgumentValue.bind(this)} id="method-arguments-value"
                    value={args[i]["value"]} placeholder="value"/>
              </div>);
          }
        }

        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit.bind(this)} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="method-name" className="control-label">Method name</label>
                        <input type="text"  className="form-control" onChange={this._onChangeName.bind(this)}
                               id="method-name" value={name} placeholder="Method Name"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="connector-method" className="control-label">Connector</label>
                        <select className="form-control" id="connector-method" value={connectorId} onChange={this._onChangeConnector.bind(this)}>
                            <option disabled>-- select an option --</option>
                            {
                                this.state.connectors.map(connector => {
                                    return <option key={connector.id} value={connector.id}>{connector.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="method-method" className="control-label">Method method</label>
                        <input type="text"  className="form-control" onChange={this._onChangeMethod.bind(this)}
                               id="method-method" value={meth} placeholder="api url"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="method-arguments" className="control-label">Arguments</label>
                    </div>
                    {argRows}
                    <div className="form-group">
                        <input type="submit" value="Save" className="btn btn-info pull-right"/>
                    </div>
                </form>
            </div>
        );
    }
}

export default MethodForm;
