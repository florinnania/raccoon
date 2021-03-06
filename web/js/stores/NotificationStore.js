import React from 'react';
import T from 'i18n-react';

import BaseStore from './BaseStore';

import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/Constants';

let ActionTypes = Constants.ActionTypes;

// set localizations
T.setTexts({
    //auth
    HTTP_200_POST_auth: 'Hi there, welcome back! :)',
    HTTP_404_POST_auth: 'Invalid credentials',
    HTTP_200_POST_me: 'Welcome to Raccoon!',
    HTTP_400_POST_me: 'Invalid email or password',
    HTTP_403_POST_me: 'Use your LDAP account to login!',
    HTTP_409_POST_me: 'Email address is already associated with an account!',

    // projects
    HTTP_200_PUT_projects: 'Project *{who}* was updated',
    HTTP_200_POST_projects: 'Project *{who}* was created',
    HTTP_200_DELETE_projects: 'Project was deleted',
    HTTP_404_GET_projects: 'Project not found',

    // environments
    HTTP_200_PUT_environments: 'Environment *{who}* was updated',
    HTTP_200_POST_environments: 'Environment *{who}* was created',
    HTTP_200_DELETE_environments: 'Environment was deleted',
    HTTP_404_GET_environments: 'Environment not found',

    // jobs
    HTTP_200_PUT_jobs: 'Job *{who}* was updated',
    HTTP_200_POST_jobs: 'Job *{who}* was created',
    HTTP_200_DELETE_jobs: 'Job was deleted',
    HTTP_404_GET_jobs: 'Job not found',
    HTTP_201_POST_jenkins: 'Your task just started',
    HTTP_302_POST_jenkins: 'Your task was aborted',

    // audit logs
    HTTP_200_POST_auditlogs: "New log entry",

    // salt
    HTTP_200_POST_salt: 'Salt command executed successfully',

    // flows
    HTTP_200_PUT_flows: 'Flow *{who}* was updated',
    HTTP_200_POST_flows: 'Flow *{who}* was created',
    HTTP_200_DELETE_flows: 'Flow was deleted',
    HTTP_404_GET_flows: 'Flow not found',

    // actions
    HTTP_200_PUT_actions: 'Action *{who}* was updated',
    HTTP_200_POST_actions: 'Action *{who}* was created',
    HTTP_200_DELETE_actions: 'Action was deleted',
    HTTP_404_GET_actions: 'Action not found',

    // connectors
    HTTP_200_PUT_connectors: 'Connector *{who}* was updated',
    HTTP_200_POST_connectors: 'Connector *{who}* was created',
    HTTP_200_DELETE_connectors: 'Connector was deleted',
    HTTP_404_GET_connectors: 'Connector not found',

    // default
    HTTP_500: 'During your action we encountered _Internal Server Error_. We\'re working on it asap.',
    HTTP_401: 'You are not authorized to do this action. Please contact your administrator.'
});


let notificationStore = null;

class NotificationStore extends BaseStore {

    constructor() {
        if (!notificationStore) {
            super();
            notificationStore = this;
        } else {
            return notificationStore;
        }

        this.instances = [];

        // register gui related actions
        AppDispatcher.registerOnce(ActionTypes.NOTIFICATION, payload => {
            this.push(payload);
        });
    }

    push(message) {
        // ignore:
        // - 200 OK GET messages
        if (message.code == 200 && message.verb.toUpperCase() == 'GET')
            return;

        this.instances = this.instances || [];
        this.instances.push(message);
        this.emitChange();
    }

    pop() {
        return this.instances.pop();
    }

    clear() {
        this.instances = [];
        this.emitChange();
    }

    getLevelAndTitle(code) {
        if (code >= 500) return ['error', 'Oh snap'];
        else if (code >= 400) return ['warning', 'Warning'];
        else if (code >= 300) return ['info', 'Heads up'];
        else if (code >= 200) return ['success', 'Well done'];
        return ['info', 'Heads up'];
    }

    display(notificationSystem) {
        // Consume each notification and add it into notification system
        let notif = this.pop();
        while (notif) {
            let data = notif.data || {};
            let [level, title] = this.getLevelAndTitle(notif.code);
            let r = notif.resource.match(/\/api\/v1\/([\w-]+)[\/]?([\w-]+)?/);
            let model = r[1], id = r[2];
            let key = `HTTP_${notif.code}_${notif.verb.toUpperCase()}_${model}`;

            if (notif.code == 401 || notif.code == 500) {
                key = `HTTP_${notif.code}`;
            }

            notificationSystem.addNotification({
                level: level,
                position: 'br',
                title: title,
                message: T.translate(key, { who: data.name })
            });

            notif = this.pop();
        }
    }
}

export default new NotificationStore();
