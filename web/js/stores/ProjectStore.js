import React from 'react';
import RaccoonApp from './../components/RaccoonApp.react.js';
import AppDispatcher from '../dispatcher/AppDispatcher';
import BaseStore from './BaseStore';
import Constants from '../constants/Constants';

let ActionTypes = Constants.ActionTypes;
let projectStore = null;

class ProjectStore extends BaseStore {

    constructor() {
        if (!projectStore) {
            super();
            projectStore = this;
        } else {
            return projectStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/projects/";

        //register BaseStore actions
        this.registerActions();

        // register gui related actions
        AppDispatcher.registerOnce(ActionTypes.PROJECT_TOGGLE_VISIBLE, payload => {
            this.toggleVisible(payload.data.id);
        });
    }

    toggleVisible(id) {
        let project = this.getById(id);
        let state = RaccoonApp.getBrowserState();

        project.visible = !project.visible;
        state.toggle.project[project.id] = project.visible;
        RaccoonApp.saveBrowserState(state);

        this.emitChange();
    }

    getToggle(id) {
        let project = this.getById(id);
        let state = RaccoonApp.getBrowserState();

        if (!project.hasOwnProperty("visible")) {
            project.visible = !!state.toggle.project[project.id];
        }

        return project.visible;
    }

    set all(data) {
        if (data) {
            data.map(item => {
                item.visible = this.getToggle(item.id);
                this.instances[item.id] = item;
            });
        }
        else {
            this.instances = {};
        }
        this.emitChange();
    }

    get all() {
        return Object.values(this.instances);
    }

}

export default new ProjectStore();
