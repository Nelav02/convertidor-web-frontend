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

export const convertirXMLaJSON = async (file, file_name) => {
  if (!file) {
    console.log("No se ha seleccionado un archivo.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("file_name", file_name);

  try {
    const response = await axios.post(
      `${API_URL}/convertirXMLtoJSON/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(
      "Error al convertir el archivo: ",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const guardarJSONenMongoDB = async (jsonData) => {
  if (!jsonData) {
    console.log("No hay datos JSON para enviar.");
    return;
  }

  const formData = new FormData();
  formData.append(
    "json_file",
    new Blob([JSON.stringify(jsonData)], { type: "application/json" }),
    "data.json"
  );

  try {
    const response = await axios.post(`${API_URL}/guardarJSON/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al guardar el archivo JSON: ",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
