// Script to remove mint authority from token and make a fix supply:

const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { AuthorityType, setAuthority } = require('@solana/spl-token');
import { getAdminAccount } from '../lib/helpers';
import {connection } from "../lib/vars";
import { loadPublicKeysFromFile } from '../lib/helpers';


(async()=>{
  console.log("====== Processing Mint Revoke=======");
  const adminAccountPrivKey = process.env.ADMIN_PRIV_KEY;
  const adminAccount = getAdminAccount(adminAccountPrivKey);

  // load the stored PublicKeys for ease of use
  let localKeys = loadPublicKeysFromFile();

  // ensure the desired script was already run
  if (!localKeys?.tokenMint)
    return console.warn("No local keys were found. Please run '3.createTokenWithMetadata.ts'");

  const tokenMint = new PublicKey(localKeys.tokenMint);

try{ 
  const tx = await setAuthority(
      connection,
      adminAccount,
      tokenMint,
      adminAccount,
      AuthorityType.MintTokens,
      null, // this sets the mint authority to null
  );
  console.log("revoke tx: ",tx)

}
  catch(error){
    console.log("Error:",error);
  }

  console.log("Completed");
})()
