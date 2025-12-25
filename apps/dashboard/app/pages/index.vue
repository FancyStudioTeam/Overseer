<script
	lang="ts"
	setup
>
	/*
	 * biome-ignore-all lint/correctness/noUnusedVariables: False positives.
	 */

	const { session } = useAuth();
	const { data, error, execute } = session;

	onMounted(async () => await execute());
</script>

<template>
	<template v-if="data">
		<h1>Welcome! {{ data.data.username }}</h1>
	</template>
	<template v-if="error">
		<h1>Something went wrong...</h1>
	</template>
</template>
