import React, { useState } from 'react';
import './App.css';
import { Landing } from './layouts/Landing';
import { NavBar } from './layouts/NavBar';
import { Dashboard } from './layouts/Dashboard';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

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
      qrcode: true,
      qrcodeModalOptions: {
          mobileLinks: [
            "metamask",
            "trust",
          ]
      },
      network: "binance",
      chainId: 56
    }
  }
};

let web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});

let provider;

function App() {
	const [selectedAccount, setSelectedAccount] = useState(undefined);

	const onConnect = async () => {
    try {
      provider = await web3Modal.connect();
    } catch(e) {
      console.log("Could not get a wallet connection", e);
      return;
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

    const accounts = await web3.eth.getAccounts();

    setSelectedAccount(accounts[0]);
  }

	return (
		<div className="App">
			<Router>
				<NavBar onConnect={onConnect} selectedAccount={selectedAccount}/>
				<Switch>
					<Route exact path="/" component={Landing} />
					<Route exact path="/dashboard">
						<Dashboard account={selectedAccount} provider={provider}/>
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
