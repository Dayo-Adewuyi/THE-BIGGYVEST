import './intro.css'
import { ethers } from 'ethers'
import { useState, useEffect, useRef } from 'react'
import abi from './abi.json'
import {networks} from './network'
import ethLogo from './ethlogo.png'
import polygonLogo from './polygonlogo.png'
import twitterLogo from './twitter-logo.svg';



export default function Intro() {

  const[allAmount, setAllAmount] = useState({
                                      buyTokenAmount:"",
                                      buyAddress:"",
                                      stakeAmount:"",
                                      transferAmount:"",
                                      transferAddress:""

                                          })
  const [userStake, setUserStake] = useState('0.00')
  const [userBalance , setUserBalance] = useState('0.00')
  const[account, setAccount] = useState(null);

  

    const [network, setNetwork] = useState('');
    


  const contractAddress = '0x4f2685F49be5f027c9Eb94e5e3F27d6cC34e0749'
  const TWITTER_HANDLE = 'wandeoki';
  const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;                                    
  
  
  const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get MetaMask -> https://metamask.io/");
				return;
			}

			// Fancy method to request access to account.
			const accounts = await ethereum.request({ method: "eth_requestAccounts" });
		
			// Boom! This should print out public address once we authorize Metamask.
			console.log("Connected", accounts[0]);
			setAccount(accounts[0]);
      
    
		} catch (error) {
			console.log("something went wrong")
		}
	}

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        // Try to switch to the Mumbai testnet
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
        });
      } catch (error) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {	
                  chainId: '0x13881',
                  chainName: 'Polygon Mumbai Testnet',
                  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                  nativeCurrency: {
                      name: "Mumbai Matic",
                      symbol: "MATIC",
                      decimals: 18
                  },
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log(error);
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
    } 
  }
   
  const checkIfWalletIsConnected = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			console.log('Make sure you have metamask!');
			return;
		} else {
			console.log('We have the ethereum object', ethereum);
		}
		
		const accounts = await ethereum.request({ method: 'eth_accounts' });

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
			setAccount(account);
		} else {
			console.log('No authorized account found');
		}
		
		// This is the new part, we check the user's network chain ID
		const chainId = await ethereum.request({ method: 'eth_chainId' });
		setNetwork(networks[chainId]);

		ethereum.on('chainChanged', handleChainChanged);
		
		// Reload the page when they change networks
		function handleChainChanged(_chainId) {
			window.location.reload();
		}
	};
  
 
  useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

  useEffect(() => {
    if (network === 'Polygon Mumbai Testnet') {
      renderInputForm();
    }
  }, [account, network])
  
  

  // const fetchStakes = async() =>{
  //  let totalStakes =  await contract.totalStakes()
    // console.log(totalStakes)
    // setTotal(totalStakes)

  // }
  function handleChange(event) {
    const {name, value} = event.target
    setAllAmount(prev => ({
        ...prev,
        [name]: value
    }))
}


  
const buyMyToken = async() =>{
  try{

   const {ethereum} = window
   if(ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const con = new ethers.Contract(contractAddress, abi.abi, signer);
    
    console.log(con)
    const price = allAmount.buyTokenAmount
    console.log(price)
    const buyAddress = allAmount.buyAddress
    console.log(buyAddress)
    const tx = await con.buytoken(buyAddress, {value: ethers.utils.parseEther(price)})
    console.log("minting new token........")
    const receipt = await tx.wait()
  
    if(receipt.status === 1 ){
      alert(`Transaction successful ${price * 1000} has been sent to you wallet`)
    }else{
      alert('transaction failed, please fund your account')
    }
    const bbb = price * 1000
    setUserBalance(bbb)
   }
    
  }catch(error){
    console.log(error)
  }}
  

const transferToken = async()=>{

  try{
    const { ethereum} = window

    if(ethereum){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const con = new ethers.Contract(contractAddress, abi.abi, signer);
      
      const add = allAmount.transferAddress
      const amn = allAmount.transferAmount
          const tx = await con.transfer(add, amn)
          console.log("transferring funds.........")
          const receipt = await tx.wait()

          if(receipt.status === 1 ){
            alert(`Transaction successful, ${amn} has been sent to you ${add}`)
          }else{
            alert('transaction failed, please fund your account')
          }
          
    }

  }catch(error){console.log(error)}

  
}

const stakeToken = async () =>{
  try{
    const {ethereum} = window

    if(ethereum){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const con = new ethers.Contract(contractAddress, abi.abi, signer);

      const stk = allAmount.stakeAmount

      const tx = await con.createStake(stk)

      const  receipt = await tx.wait()
          setUserStake(stk)
      if(receipt.status === 1){
        alert(`COngratulations!! you have successfully staked ${stk}`)
      }else{alert("staking failed, something went wrong")}
      
    }
  }catch(error){
    console.log(error)
  }
}

const tokenBalance = async () =>{
  try {
    const {ethereum} = window

    if(ethereum){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const con = new ethers.Contract(contractAddress, abi.abi, signer);

      const tx = await con.balanceOf(account)
        const balance = await tx.wait
        
      setUserBalance(ethers.utils.formatEther(tx))
      

            
  }} catch(error){
    console.log("no balance")
  }
}

const claimReward = async() => {
  try{
    const {ethereum} = window

    if(ethereum){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const con = new ethers.Contract(contractAddress, abi.abi, signer);

      const cr = await con.claimRewards()
      const receipt = await cr.wait()
        if(receipt.status===1){
          alert("congratulations your reward has been added to your balance, please withdraw")
        }else{
          alert("you can only claim rewards after 7 days")
        }
        
    }
  }catch(error){
    alert("you can only withdraw after 7days")
  }
}
const withdraw = async() => {
  try{
    const {ethereum} = window

    if(ethereum){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const con = new ethers.Contract(contractAddress, abi.abi, signer);

      const tx = await con.withdrawReward()
      const receipt = await tx.wait()
        if(receipt.status===1){
          alert('withdrawal successful')
        }else{
          alert("you can only withdraw after 7days")
        }
        setUserStake("0.00")
    }
  }catch(error){
    alert("you can only withdraw after 7days")
  }
}
const renderNotConnectedContainer = () => (
  <div className="connect-wallet-container">
    <img src="https://media.giphy.com/media/kIQRoRorbJ5AIk6joX/giphy.gif" alt="greatness" />
    {/* Call the connectWallet function we just wrote when the button is clicked */}
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect Wallet
    </button>
  </div>
);

const renderInputForm = () =>{
  if (network !== 'Polygon Mumbai Testnet') {
    return (
      <div className="connect-wallet-container">
        <p>Please connect to Polygon Mumbai Testnet</p>
      </div>
    );
  }

  return (
    <>
    <div className='right'>
     <div>
       <header>
     <div className="rectangle">
			<img alt="Network logo" className="logo" src={ network.includes("Polygon") ? polygonLogo : ethLogo} />
			{ account ? <p> Wallet: {account.slice(0, 6)}...{account.slice(-4)} </p> : <p> Not connected </p> }
		</div>
    <div> <button className='btn' onClick={tokenBalance}> View Token Balance</button></div>
      </header>
     </div>
      <div>
      <input 
                    type="text"
                    placeholder="Amount "
                    className="form--input"
                    name="buyTokenAmount"
                    value={allAmount.buyTokenAmount}
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    placeholder="Receiver's address"
                    className="form--input"
                    name="buyAddress"
                    value={allAmount.buyAddress}
                    onChange={handleChange}
                />
                <button className= "btn" onClick={buyMyToken}> Buy Token</button>
                <input                    type="text"
                    placeholder="Amount To Stake"
                    className="form--input"
                    name="stakeAmount"
                    value={allAmount.stakeAmount}
                    onChange={handleChange}
                />
                <button className='btn' onClick={stakeToken}> Stake Token</button>
      </div>
      
      <input 
                    type="text"
                    placeholder="Wallet Address"
                    className="form--input"
                    name="transferAddress"
                    value={allAmount.transferAddress}
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    placeholder="Amount"
                    className="form--input"
                    name="transferAmount"
                    value={allAmount.transferAmount}
                    onChange={handleChange}
                />
                <button className='btn' onClick={transferToken}>Transfer Tokens</button>
               
               
    </div>
    <div className='claim'>
             
      <button className='btn' onClick={claimReward}>Claim Rewards</button></div>
      <div>
      <button  className='btn' onClick={withdraw}>Withdraw Balance</button>
    </div>
    </>
 );
}
  return (
    <div className='intro' id='intro'>
    <div className='left'>
      <div className='opening'>
      <h2>Welcome To Biggyvest</h2></div>
      <div className='next'>
        <h3>Stake you Blocktokens and get 1percent everyweek!!!</h3>
      </div>
      
      <div>
       {/* <button onClick={fetchStakes}>{total}</button> */}
      </div>
      
     { account && <div>
      <p> Your balances are : Stake - {userStake} , Token - {userBalance}</p>
      
      </div>}

    
    </div>
    <div>
    {!account && renderNotConnectedContainer()}
    </div>
    <div>
    {account && renderInputForm()} 
    </div>
        
    <div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`built by @${TWITTER_HANDLE}`}</a>
				</div>
    </div>
    
  )
}
 