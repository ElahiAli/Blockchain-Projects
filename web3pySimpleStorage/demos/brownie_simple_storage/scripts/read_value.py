from brownie import SimpleStorage, accounts, config


def read_contract():
    # getting last transaction, SimpleStorage act as array.
    simple_storage = SimpleStorage[-1]
    print(simple_storage.retrive())


def main():
    read_contract()
