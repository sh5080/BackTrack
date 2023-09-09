// apiUtils.js
import axios from "axios";

export async function fetchAbcContent(filePath) {
  try {
    const response = await axios.get(
      `http://localhost:4000/api/backtrack/getBacktrack?filePath=${encodeURIComponent(
        filePath
      )}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching ABC content:", error);
    return null;
  }
}

export async function uploadAbcFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      "http://localhost:4000/api/backtrack/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading ABC file:", error);
    return null;
  }
}
