<template lang="pug">
div.container.heatmap(ref="heatmap")
    canvas(:style="{height: componentHeight}", ref="canvas")
</template>

<script>
var $ = require('jquery');
export default {
    name: 'heatmap',
    data() {
        return {
            offsetHeight: 0
        }
    },
    mounted() {
        let $el = $(this.$el);
        this.offsetHeight = $el.offset().top + parseInt($el.css('marginTop'));
    },
    computed: {
        componentHeight() {
            let maxHeight = $(window).height() - this.offsetHeight;
            return maxHeight + "px";
        }
    }
}
</script>
