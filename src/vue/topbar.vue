<template>
<div class="topbar">{{ title }}</div>
</template>

<script>
export default {
	name: "topbar",
	data() {
    	return {
        	title: "Vue TopBar"
        }
    }
}
</script>

<style lang="less" scoped>
@import "../less/variables/colors";

.topbar {
	background-color: @topbar;
	position: relative;
	top: 0;
	left: 0;
	width: 100%;
	padding: 15px;
	color: @topbar-font;
}
</style>
