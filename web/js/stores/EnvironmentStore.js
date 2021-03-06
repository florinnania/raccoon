import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';
import RaccoonApp from './../components/RaccoonApp.react.js';
import BaseStore from './BaseStore';
import Constants from '../constants/Constants';

let ActionTypes = Constants.ActionTypes;
let environmentStore = null;

class EnvironmentStore extends BaseStore {

    constructor() {
        if (!environmentStore) {
            super();
            environmentStore = this;
        } else {
            return environmentStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/environments/";

        //register BaseStore actions
        this.registerActions();

        // register actions
        AppDispatcher.registerOnce(ActionTypes.ENVIRONMENT_TOGGLE_VISIBLE, payload => {
            this.toggleVisible(payload.data.id);
        });
    }

    toggleVisible(id) {
        let environment = this.getById(id);
        let state = RaccoonApp.getBrowserState();

        environment.visible = !environment.visible;
        state.toggle.environment[environment.id] = environment.visible;
        RaccoonApp.saveBrowserState(state);

        this.emitChange();
    }

    getToggle(id) {
        let environment = this.getById(id);
        let state = RaccoonApp.getBrowserState();

        if (!environment.hasOwnProperty("visible")) {
            environment.visible = !!state.toggle.environment[environment.id];
        }

        return environment.visible;
    }

    _addInstance(instance) {
        this.instances[instance.id] = instance;
        this.instances[instance.id].visible = this.getToggle(instance.id);
    }
}

export default new EnvironmentStore();
