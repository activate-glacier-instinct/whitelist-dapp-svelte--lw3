<script lang="ts">
	import { onMount } from 'svelte';
	import Web3Modal from 'web3modal';
	import { providers, Contract } from 'ethers';
	import { WHITELIST_CONTRACT_ADDRESS, ABI } from './constants';
	import { walletConnected, joinedWhitelist, loading, numberOfWhitelisted } from './store';

	let web3ModalRef: Web3Modal;

	/**
	 * Returns a Provider or Signer object representing the Ethereum RPC with or without the
	 * signing capabilities of metamask attached
	 *
	 * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
	 *
	 * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
	 * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
	 * request signatures from the user using Signer functions.
	 *
	 * @param {*} needSigner - True if you need the signer, default false otherwise
	 */
	const getProvider = async () => {
		// Connect to Metamask
		// Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
		const provider = await web3ModalRef.connect();
		const web3Provider = new providers.Web3Provider(provider);

		// If user is not connected to the Goerli network, let them know and throw an error
		const { chainId } = await web3Provider.getNetwork();
		if (chainId !== 5) {
			window.alert('Change the network to Goerli');
			throw new Error('Change network to Goerli');
		}

		return web3Provider;
	};

	const getSigner = async () => {
		// Connect to Metamask
		// Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
		const provider = await web3ModalRef.connect();
		const web3Provider = new providers.Web3Provider(provider);

		// If user is not connected to the Goerli network, let them know and throw an error
		const { chainId } = await web3Provider.getNetwork();
		if (chainId !== 5) {
			window.alert('Change the network to Goerli');
			throw new Error('Change network to Goerli');
		}

		const signer = web3Provider.getSigner();
		return signer;
	};

	/**
	 * addAddressToWhitelist: Adds the current connected address to the whitelist
	 */
	const addAddressToWhitelist = async () => {
		try {
			// We need a Signer here since this is a 'write' transaction.
			const signer = await getSigner();
			// Create a new instance of the Contract with a Signer, which allows
			// update methods
			const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, ABI, signer);
			// call the addAddressToWhitelist from the contract
			const tx = await whitelistContract.addAddressToWhitelist();
			loading.set(true);
			// wait for the transaction to get mined
			await tx.wait();
			loading.set(false);
			// get the updated number of addresses in the whitelist
			await getNumberOfWhitelisted();
			joinedWhitelist.set(true);
		} catch (err) {
			console.error(err);
		}
	};

	/**
	 * getNumberOfWhitelisted:  gets the number of whitelisted addresses
	 */
	const getNumberOfWhitelisted = async () => {
		try {
			// Get the provider from web3Modal, which in our case is MetaMask
			// No need for the Signer here, as we are only reading state from the blockchain
			const provider = await getProvider();
			// We connect to the Contract using a Provider, so we will only
			// have read-only access to the Contract
			const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, ABI, provider);
			// call the numAddressesWhitelisted from the contract
			const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
			numberOfWhitelisted.set(_numberOfWhitelisted);
		} catch (err) {
			console.error(err);
		}
	};

	/**
	 * checkIfAddressInWhitelist: Checks if the address is in whitelist
	 */
	const checkIfAddressInWhitelist = async () => {
		try {
			// We will need the signer later to get the user's address
			// Even though it is a read transaction, since Signers are just special kinds of Providers,
			// We can use it in it's place
			const signer = await getSigner();
			const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, ABI, signer);
			// Get the address associated to the signer which is connected to  MetaMask
			const address = await signer.getAddress();
			// call the whitelistedAddresses from the contract
			const _joinedWhitelist = await whitelistContract.whitelistedAddresses(address);
			joinedWhitelist.set(_joinedWhitelist);
		} catch (err) {
			console.error(err);
		}
	};

	/*
    	connectWallet: Connects the MetaMask wallet
  	*/
	const connectWallet = async () => {
		try {
			// Get the provider from web3Modal, which in our case is MetaMask
			// When used for the first time, it prompts the user to connect their wallet
			await getProvider();
			walletConnected.set(true);

			checkIfAddressInWhitelist();
			getNumberOfWhitelisted();
		} catch (err) {
			console.error(err);
		}
	};

	let uiNumberOfWhitelisted = 0;
	let uiWalletConnected = false;
	let uiJoinedWhitelist = false;
	let uiLoading = false;

	numberOfWhitelisted.subscribe((value) => {
		uiNumberOfWhitelisted = value;
	});

	walletConnected.subscribe((value) => {
		uiWalletConnected = value;
	});

	joinedWhitelist.subscribe((value) => {
		uiJoinedWhitelist = value;
	});

	loading.subscribe((value) => {
		uiLoading = value;
	});

	onMount(() => {
		if (!uiWalletConnected) {
			// Assign the Web3Modal class to the reference object by setting it's `current` value
			// The `current` value is persisted throughout as long as this page is open
			web3ModalRef = new Web3Modal({
				network: 'goerli',
				providerOptions: {},
				disableInjectedProvider: false
			});
			connectWallet();
		}
	});
</script>

<div>
	<h1 class="title">Welcome to Crypto Devs!</h1>
	<div class="description">Its an NFT collection for developers in Crypto.</div>
	<div class="description">
		{uiNumberOfWhitelisted} have already joined the Whitelist
	</div>
	<!-- {renderButton()} -->
	{#if uiWalletConnected}
		{#if uiJoinedWhitelist}
			<div class="description">Thanks for joining the Whitelist!</div>
		{:else if uiLoading}
			<button class="button">Loading...</button>
		{:else}
			<button on:click={() => addAddressToWhitelist()} class="button"> Join the Whitelist </button>
		{/if}
	{:else}
		<button on:click={connectWallet} class="button"> Connect your wallet </button>
	{/if}
</div>
<div>
	<img class="image" src="./crypto-devs.svg" alt="decorative background image" />
</div>

<style>
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
</style>
