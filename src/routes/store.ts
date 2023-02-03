import { writable } from 'svelte/store';

export const walletConnected = writable(false)
export const joinedWhitelist = writable(false)
export const loading = writable(false)
export const numberOfWhitelisted = writable(0)
