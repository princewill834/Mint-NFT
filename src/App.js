import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import './App.css';
import Button from './Button/Button';
import abi from './contractAbi/mintABI.json'; 

const smartContractAddress = "0x8a81348e22b60f79610f2fa6308f61e6c4d10ea0";
const to = "0x6acbd30237ac7bb7e95fea2c2ff83c2c4f3ba5f2";
const mintAmount = 1


function App() {
  const [userAccount, setUserAccount] = useState(null);

  const checkWalletConnected = async() => {
  const { ethereum } = window;

    if (!ethereum) {
      console.log("Please install Metamask");
    } 

     try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      if(accounts.length !==0 ){
      console.log('Account found with address ', accounts[0]);
      setUserAccount(accounts[0]);
      }

    }
     catch (error) {
      console.log(error);
    }
  };


  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("You dont have Metamask, please install it");
    }
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" }); // Fixed typo here
      console.log('Account found with address ', accounts[0]);
      setUserAccount(accounts[0]);
    }
     catch (error) {
      console.log(error);
    }
  };

  const mintNFTHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(smartContractAddress, abi, signer);
        
        console.log('initialize payment');
        let transaction = await nftContract.mint(to, mintAmount, {value: ethers.utils.parseUnits('0')});

        console.log("Mining please wait...");
        await transaction.wait();

        console.log('Tokens minted successfully!');
      } else {
        console.log("You dont have ethereum object");
      }
    } catch (err) {
      console.log('Error minting tokens:', err);
    }

  }

  useEffect(() => {
    checkWalletConnected();
  }, []);

  return (
    <div className="App">
      <h3>Mint NFT BY Clicking The Mint Button Below</h3>

      {userAccount ? 
        <Button btnType="btn mint-nft" clicked={mintNFTHandler}>Mint NFT</Button>
       :<Button btnType="btn connect-wallet" clicked={connectWalletHandler}>Connect Wallet</Button>
      }

    </div>
  );
}

export default App;