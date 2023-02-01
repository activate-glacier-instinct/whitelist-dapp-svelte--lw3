<script>
	import Web3Modal from 'web3modal';
	import { providers, Contract } from 'ethers';
</script>

<div>
	<head>
		<title>Whitelist Dapp</title>
		<meta name="description" content="Whitelist-Dapp" />
		<link rel="icon" href="/favicon.ico" />
	</head>
	<div class="main">
		<div>
			<h1 class="title">Welcome to Crypto Devs!</h1>
			<div class="description">Its an NFT collection for developers in Crypto.</div>
			<div class="description">
				<!-- {numberOfWhitelisted} have already joined the Whitelist -->
			</div>
			<!-- {renderButton()} -->
		</div>
		<div>
			<img class="image" src="./crypto-devs.svg" alt="decorative background image" />
		</div>
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

	.image {
		width: 70%;
		height: 50%;
		margin-left: 20%;
	}

	.title {
		font-size: 2rem;
		margin: 2rem 0;
	}

	.description {
		line-height: 1;
		margin: 2rem 0;
		font-size: 1.2rem;
	}

	.button {
		border-radius: 4px;
		background-color: blue;
		border: none;
		color: #ffffff;
		font-size: 15px;
		padding: 20px;
		width: 200px;
		cursor: pointer;
		margin-bottom: 2%;
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
