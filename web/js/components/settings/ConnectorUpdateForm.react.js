import React from 'react';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import ConnectorStore from '../../stores/ConnectorStore';
import { ConnectorForm } from './ConnectorForm.react';
import localConf from '../../config/Config'


let ConnectorType = localConf.CONNECTOR_TYPE;

function getLocalState(connectorId) {
    let localState = {
        connector: ConnectorStore.getById(connectorId)
    };
    return localState;
}

class ConnectorUpdateForm extends ConnectorForm {
    constructor(props) {
        super(props);
        this.formName = 'Update connector';
        this.state = getLocalState(this.props.params.id);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.id != this.props.params.id) {
            this.props.clearValidations();
            let state = getLocalState(nextProps.params.id);
            this.setState(state);
        }
    }

    _onChange() {
        let state = getLocalState(this.props.params.id);
        this.setState(state);
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                let config = this.state.connector.config;
                try {
                    config = typeof config !== 'object' ? JSON.parse(config) : config;
                    ConnectorStore.updateById(this.state.connector.id, {
                        name: this.state.connector.name,
                        type: this.state.connector.type,
                        config: config
                    });
                }
                catch (err) {
                    error = err;
                }
            }
        });
    }

    _getDataForRender() {
        this.state.connector = ConnectorStore.getById(this.props.params.id);
        if(!this.state.connector) {
            this.state.connector = {
                name: '',
                type: '',
                config: ''
            }
        }
        return this.state.connector;
    }
}

export { ConnectorUpdateForm };
export default validation(strategy)(ConnectorUpdateForm);
