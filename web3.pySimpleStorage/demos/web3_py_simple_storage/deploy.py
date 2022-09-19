import json
from solcx import compile_standard, install_solc
from web3 import Web3
import os
from dotenv import load_dotenv

# for reading the .env file by it self.
load_dotenv()

with open("./SimpleStorage.sol", "r") as file:
    simple_storage_file = file.read()

# compile our solidity
install_solc("0.6.0")
compile_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"SimpleStorage.sol": {"content": simple_storage_file}},
        "settings": {
            "outputSelection": {
                "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
            }
        },
    },
    solc_version="0.6.0",
)

with open("compiled_code.json", "w") as file:
    json.dump(compile_sol, file)


# get bytecode -> this is the pass to get the object of bytecode in compile_sol.
bytecode = compile_sol["contracts"]["SimpleStorage.sol"]["SimpleStorage"]["evm"][
    "bytecode"
]["object"]

# get ABI
abi = compile_sol["contracts"]["SimpleStorage.sol"]["SimpleStorage"]["abi"]

# for connecting to Ganache
w3 = Web3(Web3.HTTPProvider("HTTP://127.0.0.1:7545"))
chain_id = w3.eth.chain_id
my_address = "0xd090954A433647554D124cb7f5eCD441BfBD7554"
private_key = os.getenv("PRIVATE_KEY")

# Create contract in python
SimpleStoragee = w3.eth.contract(abi=abi, bytecode=bytecode)
# Get the latest Transaction
nonce = w3.eth.getTransactionCount(my_address)

# 1_build Transaction
transaction = SimpleStoragee.constructor().buildTransaction(
    {
        "chainId": chain_id,
        "gasPrice": w3.eth.gas_price,
        "from": my_address,
        "nonce": nonce,
    }
)

# 2_sign Transaction
signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)

# 3_send the sign Transaction
tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
# wait for conformation
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

# working with the contract.
Simple_Storage = w3.eth.contract(address=tx_receipt.contractAddress, abi=abi)

print(Simple_Storage.functions.retrive().call())

# building store transaction
store_transaction = Simple_Storage.functions.store(15).buildTransaction(
    {
        "chain_id": chain_id,
        "from": my_address,
        "nonce": nonce + 1,
        "gasPrice": w3.eth.gas_price,
    }
)
