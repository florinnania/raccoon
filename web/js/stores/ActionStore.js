import React from 'react';
import FluxStore from 'flux';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import BaseStore from './BaseStore';
import Connector from '../utils/Connector';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';

let actionStore = null;

class ActionStore extends BaseStore {

    constructor() {
        if (!actionStore) {
            super();
            actionStore = this;
        } else {
            return actionStore;
        }

    }

    fetchAll() {
        let connector = new Connector();

        connector.send({
            verb: 'get',
            resource: '/api/v1/actions/'
        }, payload => {
            this.all = payload.data;
        });
    }

    filter(project = null, environment = null) {
        var result = _actions.for(action => {
            // project -> project.id, 
            if (action.project == project && action.environment == environment) {
                return action.project;
            }
        });
        return result;
    }

}

export default new ActionStore();
