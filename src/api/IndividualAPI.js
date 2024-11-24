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

export const validarXML = async (file) => {
  if (!file) {
    console.log("No se ha seleccionado un archivo para validar.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_URL}/validarXML/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al validar el archivo XML: ",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const validarJSON = async (jsonData) => {
  if (!jsonData) {
    console.log("El JSON debe ser un objeto válido para validar.");
    return;
  }

  const formData = new FormData();
  formData.append(
    "json_file",
    new Blob([JSON.stringify(jsonData)], { type: "application/json" }),
    "data.json"
  );

  try {
    const response = await axios.post(`${API_URL}/validarJSON/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al validar el archivo JSON: ",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const processarTAR = async (file) => {
  if (!file) {
    console.log("No se ha seleccionado un archivo.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_URL}/procesarTAR/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error uploading file:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const enviarListaXML = async (fileList) => {
  console.log(typeof fileList[1].size);
  console.log("Enviando archivos: ", fileList);
  return await axios.post(`${API_URL}/guardarListaArchivos/`, fileList);
};
