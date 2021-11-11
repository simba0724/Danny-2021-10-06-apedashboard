import React, { useState } from 'react';
import './App.css';
import { Landing } from './layouts/Landing';
import { NavBar } from './layouts/NavBar';
import { Dashboard } from './layouts/Dashboard';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import Web3Modal from "web3modal";

let providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        56: 'https://bsc-dataseed1.binance.org'
      },
      chainId: 56
    }
  }
};

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56],
})

let web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});

let provider;

function App() {
	// const [secureProtocolError, setSecureProtocolError] = useState(false);
  // const [network, setNetwork] = useState(undefined);
  const { connector, chainId, activate, deactivate, error, account, active } = useWeb3React();
  const [selectedAccount, setSelectedAccount] = useState(undefined);
  // const [balances, setBalances] = useState({});

  // const clearAccountData = () => {
  //   setNetwork(undefined);
  //   setSelectedAccount(undefined);
  //   setBalances({});
  // }

  // const init = () => {
  //   if(window.location.protocol !== 'https:') {
  //     setSecureProtocolError(true);
  //     return;
  //   }
  //   const providerOptions = {};

  //   web3Modal = new Web3Modal({
  //     cacheProvider: false, // optional
  //     providerOptions, // required
  //     disableInjectedProvider: false,
  //   });
  // }

  const onConnect = async () => {
    try {
      provider = await web3Modal.connect();
    } catch(e) {
      console.log("Could not get a wallet connection", e);
      return;
    }

    try {
      await activate(injected);
    } catch (ex) {
      console.log("ex", ex)
    }

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
      fetchAccountData();
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
      fetchAccountData();
    });

    // Subscribe to networkId change
    provider.on("networkChanged", (networkId) => {
      fetchAccountData();
    });

    await refreshAccountData();
  }

  const refreshAccountData = async () => {
    await fetchAccountData(provider);
  }

  const fetchAccountData = async () => {

    const web3 = new Web3(provider);

    // const chainId = await web3.eth.getChainId();

    // const chainData = evmChains?.getChain(chainId);
    // setNetwork(chainData.name);

    const accounts = await web3.eth.getAccounts();

    setSelectedAccount(accounts[0]);
  }

  // const onDisconnect = async () => {

  //   if(provider?.close) {
  //     await provider.close();

  //     await web3Modal.clearCachedProvider();
  //     provider = null;
  //   }

  //   clearAccountData();
  // }
	return (
		<div className="App">
			<Router>
				<NavBar onConnect={onConnect} selectedAccount={selectedAccount} />
				<Switch>
					<Route exact path="/" component={Landing} />
					<Route exact path="/dashboard">
						<Dashboard account={selectedAccount}/>
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
