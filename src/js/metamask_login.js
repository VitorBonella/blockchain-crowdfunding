window.userWalletAddress = null
const loginButton = document.getElementById('connect-button')


const Project_Contract_Address = "0xc5F215C911269dcb4196F328CD552881853A8f1D";
const Project_Contract_ABI = [
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

}


toggleButton()