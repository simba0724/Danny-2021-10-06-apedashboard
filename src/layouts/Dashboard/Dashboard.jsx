import React, { useEffect } from 'react';
import { Box, Paper, TableBody, TableCell, TextField, InputAdornment, TablePagination, TableFooter, TableHead, TableRow, Table, IconButton, Button, Grid, Container, Slider } from '@mui/material';

import { useTheme, createTheme } from '@mui/material/styles';
import { DashPaper } from '../../components/DashPaper';
import { BsBoxArrowInRight } from 'react-icons/bs';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { RiSendPlane2Fill } from 'react-icons/ri';

import './style.scss'

import Web3 from "web3";

import BSCABI from '../../services/abis/BSC.json';
import ERC20 from '../../services/abis/ERC20.json';

import {REACT_APP_API_KEY, contract_address} from '../../config/config'

// const darkTheme = createTheme({ palette: { mode: 'dark' } });

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <MdKeyboardArrowLeft /> : <MdKeyboardArrowRight />}
      </IconButton>
    </Box>
  );
}

export default function Dashboard({account, provider}) {
// let account = '0x0eA033cDd2288552E98E2AfC809Bad3333c095A6';
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rewardtokenadd, setRewardtokenadd] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [tokenAmount, setTokenAmount] = React.useState(0);
  const [totalMount, setTotalAmount] = React.useState(0);
  const [pendingAmount, setPendingAmount] = React.useState(0);
  const [withdrawableamount, setWithdrawable] = React.useState(0);
  const [bnbamount, setBnbamount] = React.useState(0);
  const [buyback, setBuyback] = React.useState(0);
  const [buybackamount, setBuyBackAmount] = React.useState(0);

  const [queuePosition, setQueuePosition] = React.useState('');
  const [lastrewardTime, setLastreward] = React.useState(new Date);

  const [tokenname, setTokenname] = React.useState('BNB');
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const transaction_api = "https://api.bscscan.com/api?module=account&action=txlistinternal&address="+account+"&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=" + REACT_APP_API_KEY

  let web3 = new Web3('https://bsc-dataseed1.binance.org/');
  // let web3 = new Web3(provider);
  let accountInfo = web3.eth.accounts.create();
// window.alert(web3.version)
console.log(accountInfo)
  let rewardContract = new web3.eth.Contract(BSCABI, contract_address);

  var Tx = require('ethereumjs-tx').Transaction;
  const Common = require('ethereumjs-common').default
  const BSC_FORK = Common.forCustomChain(
    'mainnet',
    {
      name: 'Binance Smart Chain Main Net',
      networkId: 56,
      chainId: 56,
      url: 'https://bsc-dataseed1.binance.org/'
    },
    'istanbul',
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  };

  const init = async () => {
    let promise = new Promise(async (resolve, reject) => {
      try {
        // get transaction history
        let response = await fetch(transaction_api);
        let data = await response.json();

        if(data.status === '1') {
          resolve(data.result);
        } else {
          resolve([]);
        }
      } catch (e) {
        console.log(e)
      }
    })
    return promise
  }

  const getAccountInfo = async () => {
    let promise = new Promise(async (resolve, reject) => {
      try {
        let currentreward = await rewardContract.methods.balanceOf(account).call()
        let buyback = await rewardContract.methods.getBNBAvailableForHolderBuyBack(account).call()
        let holdingbalance = await rewardContract.methods.dividendTokenBalanceOf(account).call()
        let currentToken = await rewardContract.methods.getUserCurrentRewardToken(account).call() // get current reward token adderss
        let accountDividendsInfo = await rewardContract.methods.getAccountDividendsInfo(account).call()

        resolve({
          holdingbalance: Number(holdingbalance.toString()) / 1000000000,
          currentreward: Number(currentreward.toString()) / 1000000000,
          buyback: Number(buyback.toString()) / 1000000000000000000,
          accountDividendsInfo: accountDividendsInfo,
          currentToken: currentToken,
        });

      } catch (e) {
        resolve(e)
      }
    })
    return promise
  }

  const setRewardToken = async () => {
    let encoded = await rewardContract.methods.setRewardToken(rewardtokenadd).encodeABI()
    let count = await web3.eth.getTransactionCount(contract_address)
    let gasPrice = await web3.eth.getGasPrice();
console.log(gasPrice)
    // var rawTx = {
    //   nonce: web3.utils.toHex(count),
    //   to : contract_address,
    //   data : encoded,
    //   gasLimit: web3.utils.toHex(100000),
    //   gasPrice: web3.utils.toHex(gasPrice),
    //   value: 0
    // }

    // const privateKey = Buffer.from(accountInfo.privateKey.replace('0x',''), 'hex')
    // var tx = new Tx(rawTx, {'common': BSC_FORK});
    // tx.sign(privateKey);

    // var serializedTx = tx.serialize();

    // web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    //   .on('receipt', function(res) {
    //     console.log(res)
    //     window.alert("Reward token changed successfully")
    //   });

    rewardContract.methods.setRewardToken(rewardtokenadd).estimateGas({from: account}).then(function(gasAmount){
      console.log("[count]=>", count)
      console.log("[gasAmount]=>", gasAmount)
      var rawTx = {
        nonce: web3.utils.toHex(count),
        to : contract_address,
        data : encoded,
        gasPrice: web3.utils.toHex(100000000000),
        gasLimit: web3.utils.toHex(300000),
        value: 0
      }

      web3.eth.accounts.signTransaction(rawTx, accountInfo.privateKey).then(signed => {
        web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', function(res) {
          console.log(res);
          window.alert("Reward token changed successfully")
        })
      });
    });
    // rewardContract.methods.setRewardToken(rewardtokenadd).send({from: account, gas:300000}, (err, res) => {
    //   if (err) {
    //     window.alert("Please Input token address")
    //     throw err;
    //   } else {
    //     console.log(res);
    //     window.alert("Reward token changed successfully")
    //   }
    // });
  }

  const onWithdraw = async () => {
    let encoded = await rewardContract.methods.claim().encodeABI()
    let count = await web3.eth.getBlockNumber()

    var tx = {
      nonce: web3.utils.toHex(count),
      to : contract_address,
      data : encoded,
      gasLimit: web3.utils.toHex(300000)
    }

    web3.eth.accounts.signTransaction(tx, accountInfo.privateKey).then(signed => {
      web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', function(res) {
        console.log(res);
        window.alert("Reward withdrawed successfully")
      })
    });
    // rewardContract.methods.claim().send({from: account, gas:300000}, (err, res) => {
    //   if (err) {
    //     window.alert("Something was wrong. Withdraw failed!")
    //     throw err;
    //   } else {
    //     console.log(res);
    //     window.alert("Reward withdrawed successfully")
    //   }
    // });
  }

  const onBuyback = async () => {
    if(buybackamount <= 0) {window.alert("Please Input BuyBack Balance."); return;}

    let encoded = await rewardContract.methods.buyBackTokensWithNoFees({from: account, value: buybackamount*1000000000000000000}).encodeABI()
    let count = await web3.eth.getBlockNumber()

    var tx = {
      nonce: web3.utils.toHex(count),
      to : contract_address,
      data : encoded,
      gasLimit: web3.utils.toHex(300000)
    }

    web3.eth.accounts.signTransaction(tx, accountInfo.privateKey).then(signed => {
      web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', function(res) {
        console.log(res);
        setBuyback(0);
        getValue();
        window.alert("Buy back successfully")
      })
    });

    // let reward = await rewardContract.methods.buyBackTokensWithNoFees({from: account, value: buybackamount*1000000000000000000}).send({from: account, gas:300000}, (err, res) => {
    //   if (err) {
    //     window.alert("Something was wrong. Buy back failed!")
    //     throw err;
    //   } else {
    //     console.log(res);
    //     setBuyback(0);
    //     getValue();
    //     window.alert("Buy back successfully")
    //   }
    // });
  }

  const showDate = (time) => {
    var date = new Date(time * 1000);

    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime;
  }

  const getTokenName = async (tokenaddress) => {
    if(tokenaddress) {
      const tokenContract = new web3.eth.Contract(ERC20, tokenaddress)

      let name = await tokenContract.methods.name().call();

      setTokenname(name)
    }
  }

  const getMyBNB = async () => {
    if(account) {
      web3.eth.getBalance(account)
        .then(val => setBnbamount(Number(val.toString()) / (1000000000000000000)))
    }
  }

  const getValue = () => {
    let data = init()
    data.then((value) => {
      setRows(value)
    });

    let getacc = getAccountInfo();
    getacc.then((value) => {
      setTokenAmount(value.holdingbalance)
      setBuyback(value.buyback)

      if(value.accountDividendsInfo) {
        setTotalAmount(Number(value.accountDividendsInfo[4].toString()) / 1000000000000000000)

        if(value.accountDividendsInfo[5] !== '0') {
          let today = Number(new Date());
          setLastreward(new Date(today - Number(value.accountDividendsInfo[5])))
        } else {
          setLastreward("")
        }
        setWithdrawable(Number(value.accountDividendsInfo[3].toString()) / 1000000000000000000)
        setQueuePosition(value.accountDividendsInfo[2].toString())
      }

      getTokenName(value.currentToken)
      getMyBNB()
    });
  }

  useEffect(() => {
    getValue();
  }, [account])

  return (
    <Box className = "dashboard">
      <Box className="title" sx={{fontSize: '30px', mt: '15px'}}>
        Welcome to BNB Shinobi Dashboard
      </Box>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item md={4} xs={12}>
            <Box className = "current">
              <Paper elevation={10} sx={{boxShadow: 'none', border: '1px solid #f6eb15'}}>
                <Box sx={{ padding: "15px" }}>
                  <Box sx={{ display: "flex", paddingBottom: "20px" }}>
                    <Box sx={{ fontSize: "22px", paddingRight: "10px", color: "rgb(17,25,53)", fontWeight: "bold" }}>Current reward:</Box>
                    <Box sx={{ backgroundColor: "#f6eb15", borderRadius: "15px", fontSize: "12px", padding: "6px 10px", width: "fit-content" }}>
                      {tokenname}
                    </Box>
                  </Box>
                  <TextField
                    id="input-with-icon-textfield"
                    label="Set your BSC Reward Token"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start" sx={{cursor: 'pointer'}} onClick={setRewardToken}>
                          <RiSendPlane2Fill />
                        </InputAdornment>
                      ),
                    }}
                    value={rewardtokenadd}
                    onChange={(e) => setRewardtokenadd(e.target.value)}
                    variant="standard"
                    size="small"
                    style={{ width: "100%" }}
                  />
                </Box>
              </Paper>
            </Box>
            <Paper elevation={10} sx={{ width: "100%", marginTop: "30px", marginBottom : "50px" }}>
              <Box sx={{ padding: "20px" }}>
                <Box sx={{ fontSize: "25px", fontWeight: "bold", color: "rgb(17,25,53)" }}>Recent Transactions</Box>
                <Box sx={{ overflowX: "scroll" }}>
                  <Table aria-label="custom pagination table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Transaction id</TableCell>
                        <TableCell align="center">Amount</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                        <TableCell align="center">Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                      ).map((row) => (
                        <TableRow key={row.hash}>
                          <TableCell component="th" scope="row">
                            {row.hash}
                          </TableCell>
                          <TableCell style={{ width: 160 }} align="center">
                            {row.nonce}
                          </TableCell>
                          <TableCell style={{ width: 160 }} align="right">
                            {row.from}
                          </TableCell>
                          <TableCell style={{ width: 160 }} align="right">
                            {row.to}
                          </TableCell>
                          <TableCell style={{ width: 160 }} align="center">
                            {showDate(row.timeStamp)}
                          </TableCell>
                        </TableRow>
                      ))}

                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                          colSpan={10}
                          count={rows.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          SelectProps={{
                            native: true,
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item md={8} xs={12}>
            <Paper elevation={10} sx={{ width: "100%", marginTop: "20px", backgroundColor: "#f6eb15", border: '1px solid black', boxShadow: 'none' }}>
              <Box sx={{ padding: "15px" }}>
                <Box sx={{ fontSize: "22px", paddingRight: "20px", color: "rgb(17,25,53)", fontWeight: "bold" }}>Your Rewards</Box>
                <DashPaper title="Your Holdings:" detail={(tokenAmount !== "undefined" ? tokenAmount : 0) + " CHAKRA"} />
                <Box sx={{ display: "flex", paddingTop: "15px", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <DashPaper title="Pending Rewards" width="30%" detail={(withdrawableamount!== "undefined" ? withdrawableamount : 0)+ " BNB"} border />
                  <DashPaper title="Total Rewards" width="30%" detail={(totalMount !== "undefined" ? totalMount : 0) + "BNB"} border />
                  <DashPaper title="Queue Position" width="30%" detail={queuePosition} border />
                </Box>
              </Box>
            </Paper>
            <Paper elevation={10} sx={{ width: "100%", marginTop: "20px", backgroundColor: "#1b1b1b" }}>
              <Box sx={{ padding: "15px", }}>
                <Box sx={{ fontSize: "22px", paddingRight: "20px", color: "white", fontWeight: "bold" }}>Faucet</Box>
                <Box sx={{ display: "flex", paddingTop: "15px", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                  <DashPaper title="Current BNB Balance" width="30%" detail={bnbamount + " BNB"} />
                  <DashPaper title="Withdrawable" width="30%" detail={(withdrawableamount!== "undefined" ? withdrawableamount : 0)  + " BNB"}>
                  </DashPaper>
                  <DashPaper title="Last Reward Paid" width="30%" detail={lastrewardTime.toString().split("GMT")[0]} />
                </Box>
                <Button elevation={1} sx={{ marginTop: "5px", backgroundColor: "#f6eb15", height: "35px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", width: '100%' }} onClick={onWithdraw}>WITHDRAW<BsBoxArrowInRight /></Button>
              </Box>
            </Paper>
            <Paper elevation={10} sx={{ width: "100%", marginTop: "20px", backgroundColor: "#f6eb15", border: '1px solid black', boxShadow: 'none' }}>
              <Box sx={{ padding: "15px" }}>
                <Box sx={{ fontSize: "22px", paddingRight: "20px", color: "rgb(17,25,53)", fontWeight: "bold" }}>Tax Free BuyBack</Box>
                <Box sx={{ display: "flex", paddingTop: "15px", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <DashPaper title="Available BuyBack Amount" width="46%" detail={(withdrawableamount!== "undefined" ? withdrawableamount : 0)+ " BNB"} border />
                  <Paper elevation={10} sx={{width: {xs: "100%", sm: "46%"}, backgroundColor: "#FFF", padding: '20px', border: '1px solid #f6eb15', boxShadow: 'none' }}>
                    <TextField
                      id="input-with-icon-textfield"
                      label="Buy Back Token Amount"
                      value={buybackamount}
                      onChange={(e) => setBuyBackAmount(Number(e.target.value))}
                      variant="standard"
                      size="small"
                      type="number"
                      style={{ width: "100%" }}
                    />
                    <Slider
                      size="small"
                      aria-label="Temperature"
                      defaultValue={0}
                      value={buybackamount}
                      onChange={(e) => setBuyBackAmount(Number(e.target.value))}
                      step={buyback / 100}
                      min={0}
                      max={buyback}
                    />
                  </Paper>
                  
                  <Button elevation={1} sx={{ marginTop: "5px", backgroundColor: "#1b1b1b", height: "35px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", width: '100%' }} onClick={onBuyback}>Buy Back<BsBoxArrowInRight /></Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box >
  );
}

export { Dashboard }