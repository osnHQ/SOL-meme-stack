import {getAdminAccount,buildTransaction,explorerURL,extractSignatureFromFailedTransaction,printConsoleSeparator,savePublicKeyToFile, saveKeypairToFile} from '../lib/helpers';

import {  connection } from "../lib/vars";

import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";

import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMint2Instruction } from "@solana/spl-token";
import {
  PROGRAM_ID as METADATA_PROGRAM_ID,
  createCreateMetadataAccountV3Instruction,
} from "@metaplex-foundation/mpl-token-metadata";


(async()=>{
  const adminAccountPrivKey = process.env.ADMIN_PRIV_KEY;
const adminAccount =getAdminAccount(adminAccountPrivKey);

console.log("Admin Account Address: ",adminAccount.publicKey);

//generate a new keypair to be used for our mint
const mintKeyPair = Keypair.generate();
saveKeypairToFile(mintKeyPair,"mintKeyPair");

console.log("Mint Address: ",mintKeyPair.publicKey.toBase58());

const tokenConfig={
  decimals:6,
  name:"JUSTINNU",
  symbol:"JINU",
  uri:"https://peach-holy-lizard-605.mypinata.cloud/ipfs/QmYeL1ZwiRWZBZ2dFvBLZvS6CxzX8KmquMaBbZXpD12ZVr"
}

 /**
   * Build the 2 instructions required to create the token mint:
   * - standard "create account" to allocate space on chain
   * - initialize the token mint
   */

  // create instruction for the token mint account
  const createMintAccountInstruction = SystemProgram.createAccount({
    fromPubkey: adminAccount.publicKey,
    newAccountPubkey: mintKeyPair.publicKey,
    // the `space` required for a token mint is accessible in the `@solana/spl-token` sdk
    space: MINT_SIZE,
    // store enough lamports needed for our `space` to be rent exempt
    lamports: await connection.getMinimumBalanceForRentExemption(MINT_SIZE),
    // tokens are owned by the "token program"
    programId: TOKEN_PROGRAM_ID,
  });
   // Initialize that account as a Mint
   const initializeMintInstruction = createInitializeMint2Instruction(
    mintKeyPair.publicKey,
    tokenConfig.decimals,
    adminAccount.publicKey,
    null
  );

  console.log("Lets set metadata for our token ....")
  /**
   * Build the instruction to store the token's metadata on chain
   * - derive the pda for the metadata account
   * - create the instruction with the actual metadata in it
   */

  // derive the pda address for the Metadata account
  const metadataAccount = PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mintKeyPair.publicKey.toBuffer()],
    METADATA_PROGRAM_ID,
  )[0];

  console.log("Metadata address:", metadataAccount.toBase58());

  // Create the Metadata account for the Mint
  const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataAccount,
      mint: mintKeyPair.publicKey,
      mintAuthority: adminAccount.publicKey,
      payer: adminAccount.publicKey,
      updateAuthority: adminAccount.publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        data: {
          creators: null,
          name: tokenConfig.name,
          symbol: tokenConfig.symbol,
          uri: tokenConfig.uri,
          sellerFeeBasisPoints: 0,
          collection: null,
          uses: null,
        },
        // `collectionDetails` - for non-nft type tokens, normally set to `null` to not have a value set
        collectionDetails: null,
        // should the metadata be updatable?
        isMutable: true,
      },
    },
  );

  /**
   * Build the transaction to send to the blockchain
   */

  const tx = await buildTransaction({
    connection,
    payer: adminAccount.publicKey,
    signers: [adminAccount, mintKeyPair],
    instructions: [
      createMintAccountInstruction,
      initializeMintInstruction,
      createMetadataInstruction,
    ],
  });

  printConsoleSeparator();

  try {
    // actually send the transaction
    const sig = await connection.sendTransaction(tx);

    // print the explorer url
    console.log("Transaction completed.");
    console.log(explorerURL({ txSignature: sig }));

    // locally save our addresses for the demo
    savePublicKeyToFile("tokenMint", mintKeyPair.publicKey);
  } catch (err) {
    console.error("Failed to send transaction:");
    console.log(tx);

    // attempt to extract the signature from the failed transaction
    const failedSig = await extractSignatureFromFailedTransaction(connection, err);
    if (failedSig) console.log("Failed signature:", explorerURL({ txSignature: failedSig }));

    throw err;
  }
})
()