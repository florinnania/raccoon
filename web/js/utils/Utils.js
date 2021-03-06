'use strict';

import crypto from 'crypto';


let UNITS = {
    seconds: 's', minute:   'm', hour:  'h',
    day:     'd', week:     'w', month: 'mon',
    year:    'y',
};

class Utils {

    /**
     * Generates a unique string based on timestamp and random number
     * @returns unique string
    */
    static uuid() {
        return (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    }

    static md5(value) {
        let md5hash = crypto.createHash('md5');
        md5hash.update(value);
        return md5hash.digest('hex');
    }

    static gravatarUrl(email) {
        return 'https://secure.gravatar.com/avatar/' + this.md5(email) + '?d=mm';
    }

    static timeAgoFormatter(value, unit, suffix, epochSeconds) {
        if (value <= 60 && unit.indexOf('second') == 0) return 'now';
        else {
            unit = UNITS[unit];
        }

        return `${value}${unit} ${suffix}`;
    }

    static sortItems(items) {
        return items.sort((a, b) => {
            let a_name = a.label || a.name;
            let b_name = b.label || b.name;
            if (a.position < b.position) return -1;
            if (a.position > b.position) return 1;
            if (a_name < b_name) return -1;
            if (a_name > b_name) return 1;
            return 0;
        })
    }
}

export default Utils;
