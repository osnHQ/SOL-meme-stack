import csv
import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()



def getTokenBal(walletAddress):
    url = os.getenv('SOL_RPC_URL')
    SPL_SPL_TOKEN_ADDRESS = os.getenv('SPL_TOKEN_ADDRESS')

    TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"

    payload = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "getTokenAccountsByOwner",
        "params": [
            walletAddress,
            {"programId": TOKEN_PROGRAM_ID},
            {"encoding": "jsonParsed"},
        ],
    }

    headers = {"accept": "application/json", "content-type": "application/json"}

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()  
    except requests.exceptions.RequestException as e:
        print(f"Error fetching balance for wallet {walletAddress}: {e}")
        return None

    try:
        response_data = json.loads(response.text)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON response for wallet {walletAddress}: {e}")
        return None

    if "result" in response_data and len(response_data["result"]["value"]) > 0:
        for tokens in response_data["result"]["value"]:
            if tokens["account"]["data"]["parsed"]["info"]["mint"] == SPL_SPL_TOKEN_ADDRESS:
                brokieBal = tokens["account"]["data"]["parsed"]["info"]["tokenAmount"]["uiAmount"]
                return brokieBal
    else:
        print(f"No accounts found for wallet {walletAddress}")
        return None
    

def writeResultsToCSV(results,output_file_path):
    with open(output_file_path,mode="a",newline="",encoding="utf-8") as csvfile:
        fieldNames = ['Address','TelegramID','Balance','SolScanUrl']
        writer = csv.DictWriter(csvfile,fieldnames=fieldNames)

        writer.writeheader()
        for result in results:
            writer.writerow(result)

  
def filterMBC(csv_file_path,minAmountHolding):
    solscan_account_lookup_url="https://solscan.io/account/"
    results = []
    with open(csv_file_path, mode="r", encoding="utf-8") as csfile:
        reader = csv.DictReader(csfile)
        print("Filtering MBC Defaulters")
        for row in reader:
            if row['InGroup?']:
                print(f"checking wallet:{row['SOLWalletAddress']}")
                TargetTokenBal = getTokenBal(row['SOLWalletAddress'])
                if TargetTokenBal is not None:  
                    if TargetTokenBal < minAmountHolding:  
                        result ={'Address':row["SOLWalletAddress"],'TelegramID':row['TelegramID'],'Balance':TargetTokenBal,'SolScanUrl':solscan_account_lookup_url+row["SOLWalletAddress"]}
                        results.append(result)
                else:
                    print(f"Error: Could not fetch balance for wallet {row['SOLWalletAddress']}. Skipping.")

    return results



input_file_name = input("Enter the input file name: ")
output_file_name = input("Enter the name of output file: ")

output_file_path = os.getenv('OUTPUT_FILE_PATH')
input_file_path = os.getenv('INPUT_FILE_PATH')


input_file = input_file_path+input_file_name+'.csv'

# Declare min amount that you want to configure 
minAmountHolding = 1000000
results = filterMBC(input_file,minAmountHolding)

output_file = (output_file_path+output_file_name+'.csv')
writeResultsToCSV(results,output_file)


