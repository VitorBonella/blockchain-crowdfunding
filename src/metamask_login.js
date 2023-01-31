import { listen_new_donations, listen_new_project, listen_withdraw } from "./ProjectContractAPI.js";


window.userWalletAddress = null
const loginButton = document.getElementById('connect-button')

//test contract ->0xEa6d3dFF7fa7CC85dA06e0dE49d64a9Ed6DBCf6d
const Project_Contract_Address = "0xDEc32c3E2C246F0d7aAf6336a626748244a876A5";
const Project_Contract_ABI = [
	{
		"anonymous": false,
		"inputs": [],
		"name": "FundsSent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "NewDonation",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "NewProject",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_to",
				"type": "address"
			}
		],
		"name": "donate",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_image",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_duration",
				"type": "uint256"
			}
		],
		"name": "newProject",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "project_list",
		"outputs": [
			{
				"internalType": "address payable[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_project_address",
				"type": "address"
			}
		],
		"name": "return_project",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "project_addr",
				"type": "address"
			}
		],
		"name": "sendFundsToOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "project_addr",
				"type": "address"
			}
		],
		"name": "timeLeftContractUnlock",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "total_projects",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]


function toggleButton() {
    if (!window.ethereum) {
        loginButton.innerText = 'MetaMask is not installed'
        return false
    }

    loginWithMetaMask()
}

async function loginWithMetaMask() {

    const provider = new ethers.providers.Web3Provider(window.ethereum,"goerli");
	await provider.send('eth_requestAccounts', []); // <- this promps user to connect metamask
	const signer = await provider.getSigner();
    
    window.userWalletAddress = await signer.getAddress()
    loginButton.children[0].textContent = window.userWalletAddress.slice(0, 10) + "..."

    
    ProjectContract = new ethers.Contract(
        Project_Contract_Address,
        Project_Contract_ABI,
        signer
      );

    loginButton.removeEventListener('click', loginWithMetaMask)
	listen_new_donations()
	listen_new_project()
	listen_withdraw()
}


toggleButton()