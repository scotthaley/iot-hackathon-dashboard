<template lang="pug">
div
    form(action="#")
        p.range-field
            input(type="range", min="5", max="100", :value="value",
                 @input="$emit('input', $event.target.value)"
            )
</template>

<script>
export default {
    name: "slider",
    props: ['value'],
    data() {
        return {
        }
    }
}
</script>
