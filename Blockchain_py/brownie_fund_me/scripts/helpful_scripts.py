from brownie import accounts, MockV3Aggregator, network, config
from web3 import Web3

FORKED_LOCAL_ENVIRONMENTS = ["mainnet-fork", "mainnet-fork-dev"]
LOCAL_BLACKCHAIN_ENVIRONMENTS = ["development", "ganache-local"]

# DECIMAL = 8
# STARTING_VALUE = 200000000000


def get_account():
    if (
        network.show_active() in LOCAL_BLACKCHAIN_ENVIRONMENTS
        or network.show_active() in FORKED_LOCAL_ENVIRONMENTS
    ):
        return accounts[0]
    return accounts.add(config["wallets"]["from_key"])


def deploy_mocks():
    print(f"The active network is {network.show_active()}")
    print("Deploying Mocks...")
    # if it was deployed dont deploy it again.
    if len(MockV3Aggregator) <= 0:
        MockV3Aggregator.deploy(8, 200000000000, {"from": get_account()})
    print("Mock Deployed!")
