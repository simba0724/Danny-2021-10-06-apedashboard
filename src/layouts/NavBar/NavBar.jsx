import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import Web3Modal from "web3modal";
import * as evmChains from "evm-chains";

import './style.scss';
import { Link } from "react-router-dom";

const providerOptions = {
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

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});

let provider;

export default function NavBar() {
  let history = useHistory();
  const [secureProtocolError, setSecureProtocolError] = useState(false);
  const [network, setNetwork] = useState(undefined);
  const [selectedAccount, setSelectedAccount] = useState(undefined);
  const [balances, setBalances] = useState({});

  const clearAccountData = () => {
    setNetwork(undefined);
    setSelectedAccount(undefined);
    setBalances({});
  }

  const init = () => {
    if(window.location.protocol !== 'https:') {
      setSecureProtocolError(true);
      return;
    }

    const providerOptions = {};

    web3Modal = new Web3Modal({
      cacheProvider: false, // optional
      providerOptions, // required
      disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    });
  }

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

    console.log("Web3 instance is", web3);

    const chainId = await web3.eth.getChainId();

    const chainData = evmChains?.getChain(chainId);
    setNetwork(chainData.name);

    const accounts = await web3.eth.getAccounts();

    console.log("Got accounts", accounts);
    setSelectedAccount(accounts[0]);
  }

  const onDisconnect = async () => {

    if(provider?.close) {
      await provider.close();

      await web3Modal.clearCachedProvider();
      provider = null;
    }

    clearAccountData();
  }

  // async function connect() {
  //   try {
  //     await activate(injected);
  //   } catch (ex) {
  //     console.log("ex", ex)
  //   }
  // }

  // async function disconnect() {
  //   try {
  //     deactivate()
  //   } catch (ex) {
  //     console.log("ex", ex)
  //   }
  // }

  const accountEllipsis = selectedAccount ? selectedAccount : null;

  useEffect(() => {
    init();
    if (selectedAccount) {
      history.push("/dashboard");
    }
  }, [selectedAccount])

  return (
    <div style={{ height: "60px", width: "100%", top: "0", position: "fixed", zIndex : "10" }}>
      <div style={{ height: "100%", backgroundColor: "rgb(0,0,0)", display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "20px", paddingRight: "20px" }}>
        <a href="https://bnbshinobi.com" style={{ display: "flex", fontSize: "18px", color: "white", alignItems: "center", height: "100%" }}>
          <img src="logo.png" style={{ height: "80%" }} />
          <div style={{ paddingLeft: "16px", color: "white" }} className="logotext">
            <span style={{ color: "#f6eb15" }}>BNB </span>SHINOBI
          </div>
        </a>
        {accountEllipsis ?
          (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "70px", width: "400px", height: "65%", fontSize: "14px", backgroundColor: "#f6eb15", cursor: "pointer" }} className = "accountEllipsis">
              {accountEllipsis}
            </span>
          ) : (
            <span style={{ padding: "0", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "70px", width: "400px", height: "65%", fontSize: "14px", backgroundColor: "#f6eb15", cursor: "pointer" }} onClick={onConnect}>
              Connect
            </span>
          )
        }
      </div>
    </div>
  );
}


export { NavBar };