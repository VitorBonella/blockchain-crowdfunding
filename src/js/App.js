import { updateNoteList } from "./ProjectView.js";

var projectList = await ProjectContract.project_list();

console.log(projectList)

await updateNoteList(projectList)

