/*
 * The below functions require:
 * 1. https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js
 */

function msgCtrl(show, hide) {
    var value = [];

    this.get = function () {
        return value;
    }

    this.add = function (msg) {
        value.push(msg);
        value = _.uniq(value);
        this.refresh();
    }

    this.drop = function (msg) {
        if (_.find(value, function (o) { return o == msg; })) {
            _.remove(value, function (o) { return o == msg; })
        }
        this.refresh();
    }

    this.dropAll = function () {
        value = [];
        this.refresh();
    }

    this.refresh = function () {
        hide();
        if (this.get().length > 0)
            show();
    }
};