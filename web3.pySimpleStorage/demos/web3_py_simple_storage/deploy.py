import json
from solcx import compile_standard, install_solc


with open("./SimpleStorage.sol", "r") as file:
    simple_storage_file = file.read()

# compile our solidity
print("installing")
install_solc("0.6.0")
compile_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"SimpleStorage": {"content": simple_storage_file}},
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
