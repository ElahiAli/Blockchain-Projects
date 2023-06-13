import "./App.css";
import FundMe from "./artifacts/contracts/FundMe.sol/FundMe.json";
import { ethers } from "ethers";
import { useState } from "react";

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function App() {
	const [deposit, setDeposit] = useState();
	const [address, setAddress] = useState("");
	const [funded, setFended] = useState("");

	async function RequestAccount() {
		await window.ethereum.request({ method: "eth_requestAccounts" });
	}

	const fundMe = async () => {
		if (!deposit) return;
		if (typeof window.ethereum !== "undefined") {
			try {
				await RequestAccount();
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const signer = provider.getSigner();
				const fundmeContract = new ethers.Contract(
					contractAddress,
					FundMe.abi,
					signer
				);

				const fee = ethers.utils.parseEther(deposit.toString());
				const fundMeTx = await fundmeContract.fund({ value: fee });
				await fundMeTx.wait();
			} catch (error) {
				console.log(error);
			}
		}
	};

	async function withdraw() {
		if (typeof window.ethereum !== "undefined") {
			try {
				await RequestAccount();
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const signer = provider.getSigner();
				const fundmeContract = new ethers.Contract(
					contractAddress,
					FundMe.abi,
					signer
				);

				const withdrawTx = await fundmeContract.cheaperWithdraw();
				await withdrawTx.wait();
			} catch (error) {
				console.log(error);
			}
		}
	}

	async function getFunder() {
		if (!address) return;
		if (typeof window.ethereum !== "undefined") {
			try {
				const provider = new ethers.providers.Web3Provider(window.ethereum);

				const fundmeContract = new ethers.Contract(
					contractAddress,
					FundMe.abi,
					provider
				);

				const newFunded = await fundmeContract.getAddressToAmountFunded(
					address
				);
				setFended(`Funde: ${newFunded.toString()}`);
				setAddress("");
			} catch (error) {
				console.log(error);
			}
		}
	}
	return (
		<div className="App">
			<div className="fundme">
				<button onClick={fundMe}>Fund</button>
				<input
					onChange={e => setDeposit(e.target.value)}
					placeholder="price"
					value={deposit}
				></input>
			</div>
			<div className="funder">
				<button onClick={getFunder}>Funder</button>
				<input
					onChange={e => setAddress(e.target.value)}
					placeholder="address"
					value={address}
				></input>
				<h3>{funded}</h3>
			</div>
			<div className="withdraw">
				<button onClick={withdraw}>withdraw</button>
			</div>
		</div>
	);
}

export default App;
