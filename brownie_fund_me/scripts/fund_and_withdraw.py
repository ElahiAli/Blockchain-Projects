from brownie import FundMe
from .helpful_scripts import get_account


def fund():
    fund_me = FundMe[-1]
    account = get_account()
    entrance_fee = fund_me.getEntranceFee()
    print(f"The current entry fee is {entrance_fee}")
    print("Funding")
    print(fund_me.fund({"from": account, "value": entrance_fee}))


def withdraw():
    fund_me = FundMe[-1]
    account = get_account()
    print("Withdraw")
    fund_me.withdraw({"from": account})


def getPrice():
    fund_me = FundMe[-1]
    account = get_account()
    print("Price: ", fund_me.getPrice({"from": account}))


def getVersion():
    fund_me = FundMe[-1]
    account = get_account()
    print("version: ", fund_me.getVersion({"from": account}))


def main():
    fund()
    withdraw()
    getVersion()
    getPrice()
