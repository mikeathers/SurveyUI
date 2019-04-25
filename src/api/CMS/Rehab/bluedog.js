import axios from "axios";
const BD_URL = "http://bluedog-repo-microservice-dev/api/";
// const BD_URL = "http://localhost:60864/api/";

export const addDocumentToBluedogCase = async document => {
  try {
    const res = await axios({
      method: "POST",
      url: BD_URL + "case/adddocumenttocase",
      dataType: "json",
      data: document
    });
    return res;
  } catch (err) {}
};
