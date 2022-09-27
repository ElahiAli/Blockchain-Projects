from brownie import FundMe
from .helpful_scripts import get_account


def deploy_fund_me():
    account = get_account()
    # publish_source is for verifing our contract., publish_source=True
    fund_me = FundMe.deploy({"from": account})
    print(f"Contract Deployed to {fund_me.address}")


def main():
    deploy_fund_me()
