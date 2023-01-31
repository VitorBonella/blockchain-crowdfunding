import { donate, get_project_info } from "./ProjectContractAPI.js";

const roott = document.getElementById("app")


function _createBoxItemHTML(image, description, total_donated, address, full_address) {
    const MAX_BODY_LENGTH = 60;

    return `
            <div class="box">
            <div class="image-space">
                <img class="box-image" src="${image}">
            </div>
            <div class="content-space">
                <div class="content-grid">
                    <div class="desc-space">
                        <a class="box-desc">${description}</a>
                    </div>
                    <div class="info-space">
                        <a class="box-info">Donated: ${total_donated}
                            Address: ${address}
                        </a>
                    </div>
                    <div class="btn-space">
                        <button class="donate-btn" id="${full_address}">
                            <p class="donate-text">Donate</p>
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function updateNoteList(project_list) {
    const boxListContainer = roott.querySelector(".box-list");

    boxListContainer.innerHTML = "";

    const provider = new ethers.providers.Web3Provider(window.ethereum,"goerli")

    for (const project of project_list) {


        let balance_amount = await provider.getBalance(project);
        balance_amount = ethers.utils.formatEther(balance_amount)

        let project_addr = project.slice(0, 10) + "..."
        console.log(balance_amount)
        let infos = await get_project_info(project)
        console.log(infos)

        const box_html = _createBoxItemHTML(infos[1],infos[2],balance_amount,project_addr,project);

        boxListContainer.insertAdjacentHTML("beforeend", box_html);

        document.getElementById(project).addEventListener('click', function(){
            donate(project);
        })
    }
}
