<template lang="pug">
nav
	div.nav-wrapper.topbar
		a.brand-logo {{ title }}
		ul(
			href='#'
			class='right hide-on-med-and-down'
			)
			li
				a(href='#') Home
			li
				a(href='#') Account
</template>

<script>
export default {
	name: "topbar",
	data() {
    	return {
        	title: 'IoT Hackathon (WiFi Heatmap)'
        }
    }
}
</script>
