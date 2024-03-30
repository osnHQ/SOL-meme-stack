import { PublicKey } from '@solana/web3.js';
import { getAdminAccount } from '../lib/helpers';
require('dotenv').config();

const adminAccountPrivKey = process.env.ADMIN_PRIV_KEY;
const adminAccount = getAdminAccount(adminAccountPrivKey);
console.log(`Admin public key: ${new PublicKey(adminAccount.publicKey)}`);
