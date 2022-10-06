from brownie import accounts, config, SimpleStorage, network

# import os


def deploy_simple_storage():
    # for working with testnet:
    # account = accounts[0]
    # print(account)

    # working with self-add account:
    # account = accounts.load("solidity-tutorial")
    # print(account)

    # working with .env file:
    # first way
    # account = accounts.add(os.getenv("PRIVATE_KEY"))
    # second way better way
    # account = accounts.add(config["wallets"]["from_key"])

    # what happend in web3.py happening here.
    account = get_account()
    simple_storage = SimpleStorage.deploy({"from": account})
    stored_value = simple_storage.retrive()
    print(stored_value)
    transaction = simple_storage.store(15, {"from": account})
    transaction.wait(1)
    update_store_value = simple_storage.retrive()
    print(update_store_value)


def get_account():
    # network is keywork that allow us to intract with deffernt networks.
    if network.show_active() == "development":
        return accounts[0]
    return accounts.add(config["wallets"]["from_key"])


def main():
    deploy_simple_storage()
