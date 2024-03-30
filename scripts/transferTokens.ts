//** NOTE: THIS SCRIPT HELPS TO TRANSFER SOLANA SPL TOKEN FROM ONE ACCOUNT TO ANOTHER */

const { PublicKey } = require('@solana/web3.js');
const { getOrCreateAssociatedTokenAccount, transfer } = require('@solana/spl-token');
import {connection} from '../lib/vars';
import { getAdminAccount,loadPublicKeysFromFile,explorerURL } from '../lib/helpers';




  // load the stored PublicKeys for ease of use
  let localKeys = loadPublicKeysFromFile();

  // ensure the desired script was already run
  if (!localKeys?.tokenMint)
     console.warn("No local keys were found. Please run '3.createTokenWithMetadata.ts'");


// Replace these with your actual values
const DESTINATION_WALLET = '4tEfs9QjdCiZBEuZfSbshnYQZzenDpYP4GzrSiKHjiqJ';
const MINT_ADDRESS = new PublicKey(localKeys.tokenMint); // Replace with your token's mint address
const TRANSFER_AMOUNT = 26666666640; // Amount of tokens to transfer

// Initialize connection


// Sender's wallet keypair 
const adminAccountPrivKey = process.env.ADMIN_PRIV_KEY;
const adminAccount =getAdminAccount(adminAccountPrivKey);


// Receiver's public key
const receiverPubkey = new PublicKey(DESTINATION_WALLET);

// Mint address
const mintAddress = new PublicKey(MINT_ADDRESS);

(async () => {
    try {
    //     Get or create associated token accounts for sender and receiver
        const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            adminAccount,
            mintAddress,
            adminAccount.publicKey
        );

        const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            adminAccount,
            mintAddress,
            receiverPubkey
        );

        // Transfer tokens
        const transferSignature = await transfer(
            connection,
            adminAccount,
            senderTokenAccount.address,
            receiverTokenAccount.address,
            adminAccount.publicKey,
            TRANSFER_AMOUNT // Adjust for token decimals
        );

        console.log(`Transfer successful. Signature: ${explorerURL({txSignature:transferSignature})}`);
    } catch (error) {
        console.error("Error transferring tokens:", error);
    }
})();
