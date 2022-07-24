/** @jsxRuntime classic */
/** @jsx jsx */

import React, { useEffect, useState } from "react";
import { jsx, Box } from 'theme-ui';
import { ethers } from "ethers";
import axios from "axios";
import { useRouter } from 'next/router'
import Web3Modal from "web3modal";
import { rgba } from 'polished';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import fileNFT from "../../artifacts/contracts/kezayya.sol/FileNFT.json";
import { fileShareAddress } from "../../config";

export default function ViewFiles() {
  const navigate = useRouter();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    loadfileNFT();
  }, []);
  const getIPFSGatewayURL = (ipfsURL) => {
    const urlArray = ipfsURL.split("/");
    const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.nftstorage.link/${urlArray[3]}`;
    return ipfsGateWayURL;
  };

  // const rpcUrl = "https://matic-mumbai.chainstacklabs.com";
  // const rpcUrl = "http://localhost:8545";

  const copyToClipBoard = async copyMe => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess('Copied!');
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  async function loadfileNFT() {
    /* create a generic provider and query for fileNFTs */
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/g2W8xo0aefctNzl-JUagHo0t-3gujrt_");
    const contract = new ethers.Contract(fileShareAddress, fileNFT.abi, provider);
    const data = await contract.fetchMyFiles();
    console.log("fileNFT data fetched from contract", data);
    /*
    *  map over items returned from smart contract and format
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId);
      console.log("token Uri is ", tokenUri);
      const httpUri = getIPFSGatewayURL(tokenUri);
      console.log("Http Uri is ", httpUri);
      const meta = await axios.get(httpUri);
      const privatefile = (i.filePrivate).toString; 

      const item = {
        privatefile: "Yes",
        tokenId: i.tokenId.toNumber(),
        image: getIPFSGatewayURL(meta.data.image),
        name: meta.data.name,
        description: meta.data.description,
        sharelink: getIPFSGatewayURL(meta.data.image),
      };
      console.log("item returned is ", item);
      return item;
    }));
    setNfts(items);
    setLoadingState("loaded");
  }
  async function share(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    console.log("item id clicked is", nft.tokenId);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(fileShareAddress, fileNFT.abi, signer);

    /* user will be prompted to pay the asking proces to complete the transaction */
    // const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createFileShare(nft.tokenId);
    await transaction.wait();
    console.log("fileNFT Share transaction completed ");
    const token = nft.tokenId;
    console.log("token id is ", token);
    loadfileNFT();
    //navigate("/view", { state: token });
  }
  if (loadingState === "loaded" && !nfts.length) {
    return (
      <div sx={styles.section}>
        <h1 className="px-20 py-10 text-3xl text-white">Empty drive, no file yet</h1>
      </div>
    );
  }
  return (
    <Box as="section"  sx={styles.section}>
      <div className="bg-purple-100 text-4xl text-center text-black font-bold pt-10">
        <h1> My Drive</h1>
      </div>
    <div className="flex justify-center bg-purple-100 mb-12">

      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 pt-4">
          {nfts.map((nft, i) => (

            <div key={i} className="border shadow rounded-xl overflow-hidden border-2 border-white-500">
              <iframe
                title="fileNFT"
                frameBorder="0"
                scrolling="no"
                height="200px"
                width="100%"
                src={`${nft.image}#toolbar=0`}
                className="py-3 object-fill h-500"
              />
              <div className="p-1">
                <p style={{ height: "34px" }} className="text-xl text-purple-700 font-semibold">Name: {nft.name}</p>
                <p className="text-xl font-bold text-black">Public : {nft.privatefile}</p>
              </div>
              {/** onClick={() => share(nft)} */}
              <div className="p-2 bg-black">
              <Popup trigger={<button type="button" className="w-full bg-purple-700 text-white font-bold py-2 px-2 rounded" >Share / Get Link</button>} 
                  position="bottom center">
                <div className=" bg-purple-200 text-black font-bold py-2 px-2 rounded">{nft.sharelink}</div>
                <button onClick={() => copyToClipBoard([nft.sharelink])}>Copy Link</button>
                
                 {copySuccess}
                </Popup>

                
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
    </Box>
  );
}

const styles = {
  section: {
    backgroundColor: 'primary',
    pt: [17, null, null, 20, null],
    pb: [6, null, null, 12, 16],
  },
 };
