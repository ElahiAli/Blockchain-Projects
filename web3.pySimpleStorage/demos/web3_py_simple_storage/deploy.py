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
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
chain_id = w3.eth.chain_id
my_address = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"
private_key = os.getenv("PRIVATE_KEY")

# Create contract in python
SimpleStorage = w3.eth.contract(abi=abi, bytecode=bytecode)
# Get the latest Transaction
nonce = w3.eth.getTransactionCount(my_address)

# 1_build Transaction
print("Deploying...")
transaction = SimpleStorage.constructor().buildTransaction(
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
print("Deployed!")
print("First amount: ", Simple_Storage.functions.retrive().call())

# store Transaction.
# 1 building store transaction
print("Updating Store Transaction...")
store_transaction = Simple_Storage.functions.store(15).buildTransaction(
    {
        "chainId": chain_id,
        "from": my_address,
        "nonce": nonce + 1,
        "gasPrice": w3.eth.gas_price,
    }
)
# 2 sign store transaction
sign_store_txn = w3.eth.account.sign_transaction(
    store_transaction, private_key=private_key
)
# 3 send store transaction
send_store_tx = w3.eth.send_raw_transaction(sign_store_txn.rawTransaction)
# wait for conformation
tx_receipt = w3.eth.wait_for_transaction_receipt(send_store_tx)

print("Updated amount: ", Simple_Storage.functions.retrive().call())
print("Store Transaction updated!")


# addperson Transaction.
print("Updating AddPerson Transaction...")
addperson_txn = Simple_Storage.functions.addperson("sahar", 24).buildTransaction(
    {
        "chainId": chain_id,
        "from": my_address,
        "nonce": nonce + 2,
        "gasPrice": w3.eth.gas_price,
    }
)
# sign Transaction.
sign_addperson_txn = w3.eth.account.sign_transaction(
    addperson_txn, private_key=private_key
)

send_addperson_txn = w3.eth.send_raw_transaction(sign_addperson_txn.rawTransaction)
addperson_reciept = w3.eth.wait_for_transaction_receipt(send_addperson_txn)

print("People Updated: ", Simple_Storage.functions.people(0).call())

print(
    "FavoriteNumber Updated: ",
    Simple_Storage.functions.nameToFavoriteNumber("sahar").call(),
)
