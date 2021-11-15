import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";

import './style.scss';
import { Link } from "react-router-dom";

import { Modal, Box, Button, Typography } from '@mui/material';
import {useWeb3React} from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const style = {
  position: 'absolute',
  top: '30%',
  left: 'calc(50% - 250px)',
  width: '500px',
  bgcolor: 'background.paper',
  borderRadius: '8px',
  padding: "5px",
};

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56],
})

const walletconnect = new WalletConnectConnector({
    rpc:{
      56: 'https://bsc-dataseed1.binance.org/v3/60ab76e16df54c808e50a79975b4779f',
      1: 'https://mainnet.infura.io/v3/60ab76e16df54c808e50a79975b4779f',
      4: 'https://rinkeby.infura.io/v3/60ab76e16df54c808e50a79975b4779f'
    },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: 12000,
});

const connectorsByName = {
    injected: injected,
    WalletConnect: walletconnect
}

export default function NavBar() {
  let history = useHistory();

  const {account, connector, chainId, activate, error, active} = useWeb3React();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const accountEllipsis = account ? account : null;

  async function connect() {
    try {
      await activate(injected)
    } catch (ex) {
      console.log("ex", ex)
    }
  }

  async function trustconnect() {
    try {
      await activate(walletconnect)
    } catch (ex) {
      console.log("ex", ex)
    }
  }

  useEffect(() => {
    if (account) {
      history.push("/dashboard");
    }
  }, [account])

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
            <span style={{ padding: "0", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "70px", width: "400px", height: "65%", fontSize: "14px", backgroundColor: "#f6eb15", cursor: "pointer" }} onClick={handleOpen}>
              Connect
            </span>
          )
        }
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Button sx={{width: '100%', padding: '20px'}} onClick={()=> {connect(); handleClose();}}>
            <Box>
              <img src="./metamask.svg" style={{width: '40px'}}/>
              <Typography variant="h5" component="h2" sx={{textAlign: 'center', color: 'black', fontWeight: '600'}}>
                MetaMask
              </Typography>
              <Typography variant="h6" component="h2" sx={{textAlign: 'center', color: '#a9a9bc', fontWeight: '400', fontSize: '14px'}}>
                Connect Your Metamask Wallet
              </Typography>
            </Box>
          </Button>
          <Button sx={{width: '100%', padding: '20px'}} onClick={()=> {trustconnect(); handleClose();}}>
            <Box>
              <img src="./walletconnect.svg" style={{width: '40px'}}/>
              <Typography variant="h5" component="h2" sx={{textAlign: 'center', color: 'black', fontWeight: '600'}}>
                WalletConnect
              </Typography>
              <Typography variant="h6" component="h2" sx={{textAlign: 'center', color: '#a9a9bc', fontWeight: '400', fontSize: '14px'}}>
                Scan with WalletConnect to connect
              </Typography>
            </Box>
          </Button>
        </Box>
      </Modal>
    </div>
  );
}


export { NavBar };