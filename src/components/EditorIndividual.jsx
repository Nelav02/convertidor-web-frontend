import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  CardFooter,
  Textarea,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  cn,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { ConvertirIcon } from "../assets/ConvertirIcon";
import { CheckIcon } from "../assets/CheckIcon";
import { AgregarArchivoIcon } from "../assets/AgregarArchivoIcon";
import { CopiarContenidoIcon } from "../assets/CopiarContenidoIcon";
import { EliminarDocumentoIcon } from "../assets/EliminarDocumentoIcon";
import { MenuIcon } from "../assets/MenuIcon";
import { DBIcon } from "../assets/DBIcon";
import {
  convertirXMLaJSON,
  enviarXML,
  guardarJSONenMongoDB,
  validarJSON,
  validarXML,
} from "../api/IndividualAPI";
import { toast, Toaster } from "sonner";

export default function EditorIndividual() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const defaultXmlCode = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <person>
    <name>John Doe</name>
    <age>30</age>
    <city>New York</city>
  </person>
</root>`;

  const defaultJsonCode = `{
  "person": {
    "name": "John Doe",
    "age": 30,
    "city": "New York"
  }
}`;

  const [xmlCode, setXmlCode] = useState(defaultXmlCode);
  const [jsonCode, setJsonCode] = useState(defaultJsonCode);
  const [fileName, setFileName] = useState("");
  const [statusXML, setStatusXML] = useState("");
  const [messageXML, setMessageXML] = useState("");
  const [statusJSON, setStatusJSON] = useState("");
  const [messageJSON, setMessageJSON] = useState("");
  //const [jsonData, setJsonData] = useState("");

  const handleFileUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".DATA";
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        if (!file.name.endsWith(".DATA")) {
          toast.error("Solo se aceptan archivos con extensión .DATA");
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error(`El archivo es demasiado grande. ${file.size} bytes`);
          return;
        }

        try {
          const response = await enviarXML(file);

          if (response.status.toLowerCase() === "valid") {
            setXmlCode(response.XMLformateado);
            setFileName(response.fileName);
            setStatusXML(response.status);
            setMessageXML(response.message);
          }
        } catch (error) {
          if (error.response && error.response.data) {
            setXmlCode("");
            setJsonCode("");
            setFileName(error.response.data.fileName);
            setStatusXML(error.response.data.status);
            setMessageXML(error.response.data.message);
          } else {
            setStatusXML("");
            setMessageXML("");
            console.log("Error al formatear el XML: ", error);
          }
        }
      }
    };
    fileInput.click();
  };

  const handleConvertToJson = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await convertirXMLaJSON(
        new File([xmlCode], { type: "text/xml" }),
        fileName
      );

      if (response.status.toLowerCase() === "valid") {
        setJsonCode(JSON.stringify(response.jsonData, null, 2));
        setFileName(response.fileName);
        setStatusJSON(response.status);
        setMessageJSON(response.message);
      } else {
        throw new Error("El estado del XML no es valido.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setJsonCode("");
        setFileName(error.response.data.fileName);
        setStatusJSON(error.response.data.status);
        setMessageJSON(error.response.data.message);
      } else {
        setStatusJSON("");
        setMessageJSON("");
        console.log("Error al convertir el XML a JSON: ", error);
      }
      throw error;
    }
  };

  const handleValidateXML = async () => {
    try {
      const response = await validarXML(
        new File([xmlCode], { type: "text/xml" })
      );

      if (response.status.toLowerCase() === "valid") {
        setStatusXML(response.status);
        setMessageXML(response.message);
      } else {
        throw new Error("El estado del XML no es valido.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setStatusXML(error.response.data.status);
        setMessageXML(error.response.data.message);
      }
      throw error;
    }
  };

  const handleValidateJSON = async () => {
    try {
      const response = await validarJSON(jsonCode);

      if (response.status.toLowerCase() === "valid") {
        setStatusJSON(response.status);
        setMessageJSON(response.message);
      } else {
        throw new Error("El estado del JSON no es valido.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setStatusJSON(error.response.data.status);
        setMessageJSON(error.response.data.message);
      }
      throw error;
    }
  };

  const handleGuardarJSONenMongoDB = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const response = await guardarJSONenMongoDB(jsonCode);
      console.log("JSON guardado en MongoDB: ", response.message);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessageJSON(error.response.data.message);
        setStatusJSON(error.response.data.status);
      }
      console.log("Error al guardar el JSON en MongoDB: ", error);
      throw error;
    }
  };

  function deleteContent() {
    try {
      setXmlCode("");
      setJsonCode("");
      setFileName("");
      setStatusXML("");
      setMessageXML("");
      setStatusJSON("");
      setMessageJSON("");
      return true;
    } catch {
      return false;
    }
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div className="grid grid-cols-2 gap-5">
      <Card className="pt-2 pb-0 bg-background/25">
        <CardHeader className="justify-between py-1">
          <div className="flex gap-5">
            <span
              className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xl font-bold text-blue-400 cursor-pointer hover:bg-blue-900 active:bg-blue-700 active:scale-95 transition-transform duration-100"
              onClick={handleFileUpload}
            >
              XML Editor
            </span>
            {fileName && (
              <Chip
                className="text-white"
                size="lg"
                color="default"
                variant="bordered"
                startContent={<CheckIcon size={24} />}
              >
                {fileName}
              </Chip>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              className="text-white text-base bg-blue-950"
              color="default"
              aria-label="Convertir a Json"
              size="sm"
              variant="flat"
              radius="sm"
              onClick={() => {
                if (fileName && xmlCode) {
                  toast.promise(handleConvertToJson, {
                    error: "Error al convertir el XML a JSON",
                    success: "XML convertido exitosamente a JSON",
                    loading: "Convirtiendo archivo ...",
                  });
                } else {
                  toast.error("No se ha subido un archivo.", {
                    description: "O vuelve a validar el archivo XML.",
                  });
                }
              }}
              endContent={<ConvertirIcon className="h-auto w-4" />}
            >
              Convertir a Json
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="solid" color="default">
                  <MenuIcon className="h-auto w-5" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="flat" aria-label="Menu de opciones">
                <DropdownItem
                  key="nuevo"
                  onPress={handleFileUpload}
                  description="Carga un nuevo archivo XML"
                  startContent={
                    <AgregarArchivoIcon
                      className={cn(iconClasses, "h-auto w-5")}
                    />
                  }
                >
                  Nuevo archivo
                </DropdownItem>
                <DropdownItem
                  key="copiar"
                  description="Copia todo el contenido XML"
                  startContent={<CopiarContenidoIcon className={iconClasses} />}
                  onPress={() => {
                    if (copyToClipboard(xmlCode)) {
                      toast.success("Contenido copiado.", {
                        duration: 1500,
                      });
                    } else {
                      toast.error("No se pudo copiar el contenido.", {
                        duration: 1500,
                      });
                    }
                  }}
                >
                  Copiar contenido
                </DropdownItem>
                <DropdownItem
                  key="validar"
                  showDivider
                  description="Validar el archivo actual"
                  startContent={<CheckIcon className={iconClasses} />}
                  onPress={() => {
                    if (fileName) {
                      toast.promise(handleValidateXML, {
                        error: "Error al validar el XML",
                        success: "XML validado exitosamente",
                        loading: "Validando archivo ...",
                      });
                    } else {
                      toast.error("No se ha subido un archivo.");
                    }
                  }}
                >
                  Validar XML
                </DropdownItem>
                <DropdownItem
                  key="limpiar"
                  className="text-danger"
                  color="danger"
                  description="Se eliminará el archivo cargado"
                  startContent={
                    <EliminarDocumentoIcon
                      className={cn(iconClasses, "text-danger")}
                    />
                  }
                  onPress={() => {
                    if (deleteContent()) {
                      toast.error("Contenido eliminado.", {
                        duration: 1500,
                      });
                    } else {
                      toast.error("No se pudo eliminar el contenido.", {
                        duration: 1500,
                      });
                    }
                  }}
                >
                  Limpiar contenido
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardHeader>
        <CardBody className="pt-2 pb-0">
          <div className="overflow-hidden rounded-lg border border-gray-700">
            <Editor
              height="65vh"
              width="47.5vw"
              defaultLanguage="xml"
              value={xmlCode}
              onChange={(value) => setXmlCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: true },
                fontSize: 13,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
              }}
            />
          </div>
        </CardBody>
        <CardFooter>
          <Textarea
            isReadOnly
            label={
              statusXML
                ? statusXML.toLowerCase() === "invalid"
                  ? `${statusXML.toUpperCase()} (${fileName})`
                  : statusXML.toUpperCase()
                : "Mensaje"
            }
            value={
              messageXML
                ? messageXML
                : "Mensaje de validación del archivo XML actual"
            }
            color={
              statusXML
                ? statusXML === "invalid"
                  ? "danger"
                  : "success"
                : "default"
            }
            labelPlacement="inside"
            size="lg"
            radius="sm"
            maxRows={1}
            classNames={{
              base: "",
              label: "font-bold text-lg py-0",
              inputWrapper: "",
              innerWrapper: "py-0",
              input: "",
              description: "",
              errorMessage: "",
            }}
          />
        </CardFooter>
      </Card>

      <Card className="pt-2 pb-0 bg-background/25">
        <CardHeader className="justify-between py-1">
          <div className="grid grid-cols1 gap-3">
            <span className="rounded-md bg-green-500/20 px-2 py-0.5 text-xl font-bold text-green-400 hover:bg-green-900">
              JSON Editor
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              className="text-white text-base bg-green-900"
              color="default"
              aria-label="Guardar en Base de Datos"
              size="sm"
              variant="flat"
              radius="sm"
              onPress={() => {
                if (jsonCode && statusJSON.toLowerCase() === "valid") {
                  onOpen();
                } else {
                  toast.error("No hay datos JSON para guardar.", {
                    description: "O vuelve a validar el archivo JSON.",
                  });
                }
              }}
              endContent={<DBIcon className="h-auto w-4" />}
            >
              Guardar en DB
            </Button>
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              isDismissable={false}
              isKeyboardDismissDisabled={true}
              backdrop="blur"
              size="md"
              radius="md"
              hideCloseButton={true}
              classNames={{
                wrapper: "",
                base: "",
                backdrop: "",
                header: "text-white bg-blue-950 px-4",
                body: "px-4 pt-4",
                footer: "px-3 py-3 gap-6",
              }}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Guardar archivo actual
                    </ModalHeader>
                    <ModalBody>
                      <p>
                        El archivo actual se guardará en la base de datos Mongo
                        DB, podrá ver el reporte en la pestaña de Reportes.
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        className="text-base"
                        onPress={onClose}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        radius="sm"
                        className="text-white text-base bg-blue-950"
                        onPress={() => {
                          toast.promise(
                            handleGuardarJSONenMongoDB().then((success) => {
                              if (success) {
                                onClose();
                              } else {
                                onClose();
                              }
                            }),
                            {
                              error: (data) => {
                                return `${data.response.data.message}`;
                              },
                              success: "JSON guardado en MongoDB",
                              loading: "Guardando JSON en MongoDB ...",
                            }
                          );
                        }}
                        endContent={<DBIcon className="h-auto w-4" />}
                      >
                        Guardar en MongoDB
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="solid" color="default">
                  <MenuIcon className="h-auto w-5" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="flat" aria-label="Menu de opciones">
                <DropdownItem
                  key="copiar"
                  description="Copia todo el contenido JSON"
                  startContent={<CopiarContenidoIcon className={iconClasses} />}
                  onPress={() => {
                    if (copyToClipboard(jsonCode)) {
                      toast.success("Contenido copiado.", {
                        duration: 1500,
                      });
                    } else {
                      toast.error("No se pudo copiar el contenido.", {
                        duration: 1500,
                      });
                    }
                  }}
                >
                  Copiar contenido
                </DropdownItem>
                <DropdownItem
                  key="validar"
                  showDivider
                  description="Validar el archivo actual"
                  startContent={<CheckIcon className={iconClasses} />}
                  onPress={() => {
                    if (fileName && jsonCode) {
                      toast.promise(handleValidateJSON(), {
                        error: "Error al validar el JSON",
                        success: "JSON validado exitosamente",
                        loading: "Validando archivo ...",
                      });
                    } else {
                      toast.error("No se ha subido un archivo.");
                    }
                  }}
                >
                  Validar JSON
                </DropdownItem>
                <DropdownItem
                  key="limpiar"
                  className="text-danger"
                  color="danger"
                  description="Se eliminará el archivo cargado"
                  startContent={
                    <EliminarDocumentoIcon
                      className={cn(iconClasses, "text-danger")}
                    />
                  }
                  onPress={() => {
                    if (deleteContent()) {
                      toast.error("Contenido eliminado.", {
                        duration: 1500,
                      });
                    } else {
                      toast.error("No se pudo eliminar el contenido.", {
                        duration: 1500,
                      });
                    }
                  }}
                >
                  Limpiar contenido
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardHeader>
        <CardBody className="pt-2 pb-0">
          <div className="overflow-hidden rounded-xl border border-gray-700">
            <Editor
              height="65vh"
              width="47.5vw"
              defaultLanguage="json"
              value={jsonCode}
              onChange={(value) => setJsonCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: true },
                fontSize: 13,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
              }}
            />
          </div>
        </CardBody>
        <CardFooter>
          <Textarea
            isReadOnly
            label={
              statusJSON
                ? statusJSON.toLowerCase() === "invalid"
                  ? `${statusJSON.toUpperCase()} (${fileName})`
                  : statusJSON.toUpperCase()
                : "Mensaje"
            }
            value={
              messageJSON
                ? messageJSON
                : "Mensaje de validación del archivo JSON actual"
            }
            color={
              statusJSON
                ? statusJSON === "invalid"
                  ? "danger"
                  : "success"
                : "default"
            }
            labelPlacement="inside"
            size="lg"
            radius="sm"
            maxRows={1}
            classNames={{
              base: "",
              label: "font-bold text-lg py-0",
              inputWrapper: "",
              innerWrapper: "py-0",
              input: "",
              description: "",
              errorMessage: "",
            }}
          ></Textarea>
        </CardFooter>
      </Card>

      <Toaster
        richColors
        position="bottom-center"
        expand={true}
        theme="dark"
        visibleToasts={3}
      />
    </div>
  );
}
