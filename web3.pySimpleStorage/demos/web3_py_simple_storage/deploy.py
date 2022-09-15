import json
import weakref
from solcx import compile_standard, install_solc
from web3 import Web3

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
my_address = "0xDE9aA8ca3f990827B9eaf7d0C321Ba0A3b250fDf"
private_key = "af73994fd7154cece7f8009587b7cc78608abf0ba658637b4f045a09b0ecf77f"

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


signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)
