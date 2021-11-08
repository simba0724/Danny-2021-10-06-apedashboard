import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import './style.scss';
import { Link } from "react-router-dom";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56],
})

export default function NavBar() {
  const { connector, chainId, activate, deactivate, error, account, active } = useWeb3React();
  let history = useHistory();

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log("ex", ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
    } catch (ex) {
      console.log("ex", ex)
    }
  }
  const accountEllipsis = account ? account : null;

  useEffect(() => {
    if (active) {
      history.push("/dashboard");
    }
  }, [active])

  return (
    <div style={{ height: "60px", width: "100%", top: "0", position: "fixed", zIndex : "10" }}>
      <div style={{ height: "100%", backgroundColor: "rgb(0,0,0)", display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "20px", paddingRight: "20px" }}>
        <a href="https://bnbshinobi.com" style={{ display: "flex", fontSize: "18px", color: "white", alignItems: "center", height: "100%" }}>
          <img src="logo.png" style={{ height: "80%" }} />
          <div style={{ paddingLeft: "16px", color: "white" }} className="logotext">
            <span style={{ color: "#f6eb15" }}>BNB </span>SHINOBI
          </div>
        </a>
        {active ?
          (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "70px", width: "400px", height: "65%", fontSize: "14px", backgroundColor: "#f6eb15", cursor: "pointer" }} className = "accountEllipsis">
              {accountEllipsis}
            </span>
          ) : (
            <span style={{ padding: "0", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "70px", width: "400px", height: "65%", fontSize: "14px", backgroundColor: "#f6eb15", cursor: "pointer" }} onClick={connect}>
              Connect
            </span>
          )
        }
      </div>
    </div>
  );
}


export { NavBar };