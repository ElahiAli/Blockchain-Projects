const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage;

    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorage = await simpleStorageFactory.deploy();
    });

    it("Should start with a favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = "0";
        // expect
        // assert
        assert.equal(currentValue.toString(), expectedValue);
        // expect(currentValue.toString()).to.equal(expectedValue)  //just like assert.
    });

    it("Should update when we call store", async function () {
        const expectedValue = "9";
        const storeResponse = await simpleStorage.store(expectedValue);
        await storeResponse.wait(1);

        const updatedValue = await simpleStorage.retrieve();
        assert.equal(updatedValue.toString(), expectedValue);
    });

    it("Should store name and favorite number", async () => {
        const transactionResponse = await simpleStorage.addPerson("ali", "9");
        await transactionResponse.wait(1);
        const expectedValue = "9,ali";

        const storedValue = await simpleStorage.people(0);
        assert.equal(storedValue.toString(), expectedValue);
    });

    it("Should return favorite number when get the name", async () => {
        const expectedValue = "9";
        const transactionResponse = await simpleStorage.addPerson(
            "ali",
            expectedValue
        );
        await transactionResponse.wait(1);

        const nameToNumber = await simpleStorage.nameToFavoriteNumber("ali");
        assert.equal(nameToNumber.toString(), expectedValue);
    });
});
