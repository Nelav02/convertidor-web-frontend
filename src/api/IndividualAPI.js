import axios from "axios";

const API_URL = "http://localhost:8000";

export const enviarXML = async (file) => {
  if (!file) {
    console.log("No se ha seleccionado un archivo.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("file_name", file.name);

  try {
    const response = await axios.post(`${API_URL}/formatearXML/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log(
      "Error al subir el archivo: ",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
