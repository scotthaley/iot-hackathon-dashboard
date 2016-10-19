var constants = require('./constants.js');
var Vue = require('vue/dist/vue.js');

var app = require('vue/app.vue');

new Vue({
    el: '#app',
    render: function (createElement) {
        return createElement(app);
    }
});
