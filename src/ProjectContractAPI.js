import { updateAPP } from "./App.js";

const image_url = document.getElementById('url-image')
const description_text = document.getElementById('desc')
const duration = document.getElementById('end-donations')
const submit = document.getElementById('submit-np')


async function new_project() {

    let imageUrl = image_url.value;
    let descText =  description_text.value;
    let duration_ = new Date(duration.value);
    
    //get duration
    var now2 = new Date();
    const seconds_dur = Math.floor(duration_.getTime() / 1000);
    const seconds_now = Math.floor(now2.getTime() / 1000);

    let real_duration = seconds_dur-seconds_now + (60*5);

    ProjectContract.newProject(imageUrl,descText,real_duration).catch((err) => {
        alert("Error creating new project" + err.message);
    });

    closeForm()
}

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str))
}

export async function donate(address){


    var donated_value = prompt("Type the value to donate")
    donated_value = donated_value.replace(",", ".");

    if (!isNumeric(donated_value)){
        alert("Not a valid number")
        return
    }

    const options = {value: ethers.utils.parseEther(donated_value)}

    await ProjectContract.donate(address, options).catch((err) => {
        alert("Error donating" + err.message);
    });

}

export async function get_project_info(address){


    return ProjectContract.return_project(address).catch((err) => {
        alert("Error getting project info" + err.message);
    });

}

export async function get_time_left(address){

    return ProjectContract.timeLeftContractUnlock(address).catch((err) => {
        console.log(address + "time over")
    });

}

export function listen_new_donations(){


    ProjectContract.on("NewDonation", function(sender, amount){
        updateAPP()
    });

}

export function listen_new_project(){

    ProjectContract.on("NewProject", function(sender, amount){
        updateAPP()
    });

}

export function listen_withdraw(){

    ProjectContract.on("FundsSent", function(sender, amount){
        updateAPP()
    });

}

export function unlock(address){

    ProjectContract.sendFundsToOwner(address).catch((err) => {
        alert("Error sending funds to owner" + err.message);
    });

}

submit.addEventListener('click', new_project)
