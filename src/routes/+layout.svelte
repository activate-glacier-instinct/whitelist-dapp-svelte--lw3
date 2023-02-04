<script lang="ts">
</script>

<svelte:window />

<div>
	<head>
		<title>Whitelist Dapp</title>
		<meta name="description" content="Whitelist-Dapp" />
		<link rel="icon" href="/favicon.png" />
	</head>
	<div class="main">
        <slot />
	</div>

	<footer class="footer">Made with &#10084; by Crypto Devs</footer>
</div>

<style>
	.main {
		min-height: 90vh;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-family: 'Courier New', Courier, monospace;
	}

	.footer {
		display: flex;
		padding: 2rem 0;
		border-top: 1px solid #eaeaea;
		justify-content: center;
		align-items: center;
	}
	@media (max-width: 1000px) {
		.main {
			width: 100%;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}
</style>
