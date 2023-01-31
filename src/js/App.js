import { updateNoteList, updateLastDonation } from "./ProjectView.js";


try {

    await new Promise(r => setTimeout(r, 1*1000));

    var projectList = await ProjectContract.project_list();

    console.log(projectList)

    await updateNoteList(projectList)
    await updateLastDonation()
}
catch (e) {
    console.log(e)
    await new Promise(r => setTimeout(r, 5*1000));
    location.reload()
}


