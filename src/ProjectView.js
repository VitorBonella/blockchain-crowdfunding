import { donate, get_project_info, get_time_left, unlock } from "./ProjectContractAPI.js";

const roott = document.getElementById("app")

function _createDonationItemHTML(darker,sender,amount,time) {
    return `
    <div class="container ${darker}">
    <p>Address: ${sender} Just Donated ${amount} goerli</p>
    <span class="time-right">${time}</span>
    </div>
    `;
}


function _createBoxItemHTML(image, description, total_donated, address, full_address, time_left) {
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
                            Time Remain: ${time_left}
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

function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

function returnCollectButton(addr){

    return `
    <button id="${addr}">Collect</button>
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

        let infos = await get_project_info(project)

       
        //se tiver aberto mostra
        if(infos[3]){
            let time_left = await get_time_left(project);
            let over = false;
            if(time_left == undefined){
                time_left = returnCollectButton(project_addr)
                over = true
            }else{
                time_left = secondsToDhms(time_left)
            }
            const box_html = _createBoxItemHTML(infos[1],infos[2],balance_amount,project_addr,project,time_left);

            boxListContainer.insertAdjacentHTML("beforeend", box_html);

            document.getElementById(project).addEventListener('click', function(){
                donate(project);
            })
            
            if(over){
                document.getElementById(project_addr).addEventListener('click', function(){
                    unlock(project);
                })
            }
            

        }
    }
}

export async function updateLastDonation(){

    const donationListContainer = roott.querySelector(".new-donation");

    donationListContainer.innerHTML = "";

    let eventFilter = ProjectContract.filters.NewDonation()
    let events = await ProjectContract.queryFilter(eventFilter, 0, "latest")
    let events_r = events.reverse();
  
    var donate_html = undefined;
    let cont = 0;
    for (const dn of events_r) {
        if (cont == 4){
            break;
        }
        
        let am = ethers.utils.formatEther(dn['args']['amount'])
        let sd = dn['args']['sender'].slice(0, 10) + "..."

        if(cont % 2 == 0){
            donate_html = _createDonationItemHTML("",sd,am,new Date().toUTCString())
        }
        else{
            donate_html = _createDonationItemHTML("darker",sd,am,new Date().toUTCString())
        }
        
        donationListContainer.insertAdjacentHTML("beforeend", donate_html);
        cont++;
    }

}