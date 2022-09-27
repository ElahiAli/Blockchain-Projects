from brownie import FundMe, MockV3Aggregator, network, config
from .helpful_scripts import deploy_mocks, get_account, LOCAL_BLACKCHAIN_ENVIRONMENTS


def deploy_fund_me():
    account = get_account()

    # publish_source is for verifing our contract., publish_source=True
    # if we are on persistent network like rinkeby, use the associated address
    # otherwise, deploy mocks
    if network.show_active() not in LOCAL_BLACKCHAIN_ENVIRONMENTS:
        price_feed_address = config["networks"][network.show_active()][
            "eth_usd_price_feed"
        ]

    else:
        deploy_mocks()
        # the latest mock that compiled.
        price_feed_address = MockV3Aggregator[-1].address

    fund_me = FundMe.deploy(price_feed_address, {"from": account})
    print(f"Contract Deployed to {fund_me.address}")


def main():
    deploy_fund_me()
