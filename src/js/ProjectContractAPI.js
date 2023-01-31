const image_url = document.getElementById('url-image')
const description_text = document.getElementById('desc')
const submit = document.getElementById('submit-np')


async function new_project() {

    let imageUrl = image_url.value;
    let descText =  description_text.value;

    ProjectContract.newProject(imageUrl,descText).catch((err) => {
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

submit.addEventListener('click', new_project)