import React from 'react';
import FluxStore from 'flux';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import Connector from '../utils/Connector';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';



class BaseStore extends EventEmitter {
    constructor() {
        super();
        this.instances = null;
    }

    emitChange() {
        this.emit('change');
    }

    addListener(callback) {
        this.on('change', callback);
    }

    removeListener(callback) {
        super.removeListener('change', callback);
    }

    get all() {
        return this.instances || [];
    }

    set all(data) {
        this.instances = data;
        this.emitChange();
    }

}

export default BaseStore;
