import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";

import './style.scss';
import { Link } from "react-router-dom";

export default function NavBar({selectedAccount, onConnect, init}) {
  let history = useHistory();

  const accountEllipsis = selectedAccount ? selectedAccount : null;

  useEffect(() => {
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