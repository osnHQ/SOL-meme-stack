## SOLANA-SPL-TOKEN  
This open-source repository provides a comprehensive toolkit for building decentralized meme applications on the Solana blockchain. It empowers developers with essential functionalities to create, manage, and interact with meme-related tokens (NFTs) on Solana. 

## Setup locally

1. Clone this repo to your local system
2. Install the packages via `npm install`
3. Copy rename the `example.env` file to be named `.env`
4. Update the `RPC_URL` variable to be the cluster URL of a supporting RPC provider

## Recommended flow to explore this repo

After setting up locally, we recommend exploring the code of the following files (in order):

- [`createToken.ts`](./scripts/createToken.ts.ts)
- [`mintSupply.ts`](./scripts/mintSupply.ts)
- [`revokeMintAuthority.ts`](./scripts/revokeMintAuthority.ts)
- [`transferToken.ts`](./scripts/transferToken.ts)
- [`updateTokenMetadata.ts`](./scripts/updateTokenMetadata.ts)

After reviewing the code in each of these scripts, try running each in order.

> **Note:** Running each of these scripts may save some various bits of data to a `.local_keys`
> folder within this repo for use by the other scripts later in this ordered list. Therefore,
> running them in a different order may result in them not working as written/desired. You have been
> warned :)

#### `createToken.ts`

1. This script helps to create a token on solana chain with metadata.
2. Before you create token using this script if you want your token metadata to be rendered in solscan/solana explorer use the metadata template in this repository [assets](./assets/JIN_Metadata.json).

#### `mintSupply.ts`

This script helps to mint the supply of tokens that we created using the [create](./scripts/createToken.ts) script.

#### `revokeMintAuthority.ts`

With the help of [revokeMintAuthority](./scripts/revokeMintAuthority.ts) script we can revoke mint authority on token we minted and therefore ensures no more tokens can be minted and token have a fixed circulating supply.

#### `transferToken.ts`

This script helps to transfer specified amount of tokens to target address passed in [transfer](./scripts/transferTokens.ts) script.

#### `updateTokenMetadata.ts`

This [updateTokenMetadata](./scripts/updateTokenMetadata.ts) script helps to update metadata of token if we need to rectify anything.

#### `balance-validator.py`

This [balance-validator](./balance-validator/balance-validator.py) script helps spl-token community admins to implement various gamifications with token holders
inititaly this script provides a filtering mechanism based on wallet address token holding balance but can be expanded to other features.
