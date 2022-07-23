/** @jsxRuntime classic */
/** @jsx jsx */

import React, { useState } from "react";
import { jsx, Box } from 'theme-ui';
import { NFTStorage } from "nft.storage";
import { filesFromPath } from 'files-from-path'
import path from 'path'
import { useRouter } from 'next/router'
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { rgba } from 'polished';
// import 'dotenv/config';
import fileNFT from "../../artifacts/contracts/kezayya.sol/FileNFT.json";
import { fileShareAddress } from "../../config";
// const APIKEY = [process.env.NFT_STORAGE_API_KEY];
const APIKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA4Zjc4ODAwMkUzZDAwNEIxMDI3NTFGMUQ0OTJlNmI1NjNFODE3NmMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MzA1NjE4NzM4MCwibmFtZSI6InBlbnNpb25maSJ9.agI-2V-FeK_eVRAZ-T6KGGfE9ltWrTUQ7brFzzYVwdM";

const MintFile = () => {
  const navigate = useRouter();
  const [filePaths, setFilePaths] = useState([])
  const [errorMessage, setErrorMessage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState();
  const [imageView, setImageView] = useState();
  const [metaDataURL, setMetaDataURl] = useState();
  const [txURL, setTxURL] = useState();
  const [txStatus, setTxStatus] = useState();
  const [formInput, updateFormInput] = useState({ name: "",  privatefile: "false" });

  const handleFileUpload = (event) => {
    console.log("folder for upload selected...");
    setUploadedFile(Array.from(event.target.files));
    // onPickFiles(Array.from(e.target.files));
    // const handleFilesChange = e => onPickFiles(Array.from(e.target.files))
    //setUploadedFile(event.target.files);
    
   // setUploadedFile(files);
    setTxStatus("");
    setImageView("");
    setMetaDataURl("");
    setTxURL("");
  };

  const uploadNFTContent = async (inputFile) => {
    const { name, privatefile } = formInput;
    if (!name || !privatefile|| !inputFile) return;

    const filePaths = inputFile.map(f => f.path)
    console.log(`storing files from {filePaths}`)
    setFilePaths(filePaths)

    const nftStorage = new NFTStorage({ APIKEY });
    try {
      console.log("Trying to upload folder to ipfs");
      setTxStatus("Uploading Folder to IPFS & Filecoin via NFT.storage.");
      console.log(`storing files from {filePaths}`)
      const metaData = await nftStorage.storeDirectory(filePaths);
      console.log("cid is: ", { metaData });
      setMetaDataURl(metaData.url);
      
      
      const status = await nftStorage.status(metadata)
      console.log(status)
      return metaData;
    } catch (error) {
      setErrorMessage("Could store file to NFT.Storage - Aborted file upload.");
      console.log("Error Uploading Content", error);
    }
  };

  const sendTxToBlockchain = async (metadata) => {
    try {
      setTxStatus("Adding transaction to Polygon Mumbai Blockchain.");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const privatefile = formInput.privatefile.toString();

      const connectedContract = new ethers.Contract(fileShareAddress, fileNFT.abi, provider.getSigner());
      console.log("Connected to contract", fileShareAddress);
      console.log("IPFS blockchain uri is ", metadata.url);

      const mintNFTTx = await connectedContract.createFile(metadata.url, privatefile);
      console.log("File successfully created and added to Blockchain");
      await mintNFTTx.wait();
      return mintNFTTx;
    } catch (error) {
      setErrorMessage("Failed to send tx to Polygon Mumbai.");
      console.log(error);
    }
  };

  const previewNFT = (metaData, mintNFTTx) => {
    console.log("getIPFSGatewayURL2 two is ...");
    //const imgViewString = getIPFSGatewayURL(metaData.data.image.pathname);
    //console.log("image ipfs path is", imgViewString);
    //setImageView(imgViewString);
    setMetaDataURl(getIPFSGatewayURL(metaData));
    //setTxURL(`https://mumbai.polygonscan.com/tx/${mintNFTTx.hash}`);
    setTxStatus("File addion was successfully!");
    console.log("Preview details completed");
  };

  const mintNFTFile = async (e, uploadedFile) => {
    e.preventDefault();
    // 1. upload File content via NFT.storage
    const metaData = await uploadNFTContent(uploadedFile);

    // 2. Mint a NFT token on Polygon
    const mintNFTTx = await sendTxToBlockchain(metaData);

    // 3. preview the minted nft
   previewNFT(metaData, mintNFTTx);

    //navigate("/explore");
    // navigate.push('/dashboard')
  };

  const getIPFSGatewayURL = (ipfsURL) => {
    //const urlArray = ipfsURL.split("/");
    //console.log("urlArray = ", urlArray);
    //const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.nftstorage.link/${urlArray[3]}`;
    console.log("ipfsGateWayURL = ", "ipfsGateWayURL")
    return "https://${urlArray[2]}.ipfs.nftstorage.link/${urlArra";
  };

  return (
    <Box as="section"  sx={styles.section}>
      <div className="bg-purple-100 text-4xl text-center text-black font-bold pt-10">
        <h1> Add Folder</h1>
      </div>
      <div className="flex justify-center bg-purple-100">
        <div className="w-1/2 flex flex-col pb-12 ">
        <input
            placeholder="Give the file a name"
            className="mt-5 border rounded p-4 text-xl"
            onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
          />
          <select
            className="mt-5 border rounded p-4 text-xl text-black bg-white"
            onChange={(e) => updateFormInput({ ...formInput, privatefile: e.target.value })}
          ><option value="select">Folder should be private?</option>
            <option value="true">Yes</option>
            <option value="false">No</option> 
          </select>
          <br />

          <div className="MintNFT text-black text-xl text-black">
            <form>
              <h3>Select a Folder</h3>
              <input type="file" multiple directory="" mozdirectory=""  webkitdirectory='true' onChange={handleFileUpload} className="text-black mt-5 border rounded p-4 text-xl" />
            </form>
            {txStatus && <p>{txStatus}</p>}
            <br />
            {metaDataURL && <p className="text-blue"><a href={metaDataURL} className="text-blue">Metadata on IPFS</a></p>}
            <br />
            {txURL && <p><a href={txURL} className="text-blue">See the mint transaction</a></p>}
            <br />
            {errorMessage}

            <br />
            {imageView && (
            <iframe
              className="mb-10"
              title="File"
              src={imageView}
              alt="File preview"
              frameBorder="0"
              scrolling="auto"
              height="50%"
              width="100%"
            />
            )}

          </div>

          <button type="button" onClick={(e) => mintNFTFile(e, uploadedFile)} className="font-bold mt-20 bg-purple-700 text-white text-2xl rounded p-4 shadow-lg">
            Publish Folder
          </button>
        </div>
      </div>
    </Box>

  );
};
export default MintFile;

const styles = {
  section: {
    backgroundColor: 'primary',
    pt: [17, null, null, 20, null],
    pb: [6, null, null, 12, 16],
  },
};
