import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Spinner,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Editor } from "@monaco-editor/react";
import React, { useState } from "react";
import { EditIcon } from "../assets/EditIcon";
import { DeleteIcon } from "../assets/DeleteIcon";
import { columns } from "../utils/data";
import { CheckIcon } from "../assets/CheckIcon";
import { DBIcon } from "../assets/DBIcon";
import { MenuIcon } from "../assets/MenuIcon";
import { InfoIcon } from "../assets/InfoIcon";
import { EliminarDocumentoIcon } from "../assets/EliminarDocumentoIcon";
import { processarTAR, validarXML } from "../api/IndividualAPI";
import { AgregarArchivoIcon } from "../assets/AgregarArchivoIcon";
import { ArchivoIcon } from "../assets/ArchivoIcon";
import { NotificacionIcon } from "../assets/NotificacionIcon";
import { toast, Toaster } from "sonner";
import { CerrarIcon } from "../assets/CerrarIcon";
import { FileCodeIcon } from "../assets/FileCodeIcon";
import { VerificatorIcon } from "../assets/VerificatorIcon";

export default function PasoAPaso() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [languajeEditor, setLanguajeEditor] = useState(null);
  //const [isLoading, setIsLoading] = useState(false);
  const [infoTAR, setInfoTAR] = useState(null);
  const [extractedFiles, setExtractedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [statusXML, setStatusXML] = useState("");
  const [messageXML, setMessageXML] = useState("");

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const [page, setPage] = useState(1);
  const rowsPerPage = 11;

  const pages = Math.ceil(extractedFiles.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return extractedFiles.slice(start, end);
  }, [page, extractedFiles, rowsPerPage]);

  const handleFileUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".tar.gz";
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        if (!file.name.endsWith(".tar.gz")) {
          toast.error(
            "Solo se aceptan archivos comprimidos con extensión .tar.gz"
          );
          return;
        }

        if (file.size > 50 * 1024 * 1024) {
          toast.error(`El archivo es demasiado grande. (Max 50MB)`);
          return;
        }

        setExtractedFiles([]);
        setInfoTAR(null);

        try {
          toast.promise(processarTAR(file), {
            loading: () => {
              return "Descomprimiendo archivo ... ";
            },
            error: (response) => {
              console.log(response);
              return `Error al descomprimir el archivo. ${response.message}`;
            },
            success: (response) => {
              setExtractedFiles(response.extracted_files);
              setInfoTAR(response.tar_info);
              return `Archivo ${file.name} descomprimido correctamente.`;
            },
          });
        } catch (error) {
          console.log(error);
        }
      }
    };

    fileInput.click();
  };

  const handleValidateXML = async (content) => {
    try {
      const response = await validarXML(
        new File([content], { type: "text/xml" })
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

  const handleSaveInDB = async () => {
    console.log("DB: ", extractedFiles);
  };

  const handleModifyXML = (item) => {
    setSelectedFile(item.content);
    setSelectedItem(item);
    setLanguajeEditor(item.type === "application/xml" ? "xml" : "plaintext");
    if (item.type === "application/xml") {
      handleValidateXML(item.content);
    }
    onOpen();
  };

  const handleCloseModal = async () => {
    try {
      const response = await validarXML(
        new File([selectedFile], { type: "text/xml" })
      );

      if (response.status.toLowerCase() === "valid") {
        setStatusXML(response.status);
        setMessageXML(response.message);

        handleSaveContent();

        setSelectedFile(null);
        setSelectedItem(null);
        setLanguajeEditor(null);
        setStatusXML("");
        setMessageXML("");
        onClose();
      } else {
        toast.error("Debe ser un XML válido para cerrar el editor.");
        throw new Error("El estado del XML no es valido.");
      }
    } catch (error) {
      toast.error("Error al validar el archivo XML.");
      if (error.response && error.response.data) {
        setStatusXML(error.response.data.status);
        setMessageXML(error.response.data.message);
      }
      throw error;
    }
  };

  /*setSelectedFile(null);
    setSelectedItem(null);
    setLanguajeEditor(null);
    setStatusXML("");
    setMessageXML("");
    onClose();*/

  const handleDeleteXML = (item) => {
    setExtractedFiles((prevFiles) =>
      prevFiles.filter((file) => file.id !== item.id)
    );

    toast.error(`Archivo eliminado: ${item.filename}`);
  };

  const handleSaveContent = () => {
    let item_selected = extractedFiles.filter(
      (file) => file.id == selectedItem.id
    );

    item_selected[0].content = selectedFile;
  };

  function deleteContent() {
    try {
      setInfoTAR(null);
      setExtractedFiles([]);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div>
      <Card className="bg-background/25">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <span
              onClick={handleFileUpload}
              className="cursor-pointer rounded-md bg-green-500/20 px-2 py-0.5 text-xl font-bold text-green-400 hover:bg-green-900 active:scale-95 transition-transform duration-100"
            >
              .TAR.GZ
            </span>
            {infoTAR && (
              <Chip
                className="text-white"
                size="lg"
                color="default"
                variant="bordered"
                startContent={<CheckIcon size={24} />}
              >
                {infoTAR.filename}
              </Chip>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              className="text-white text-base bg-green-900"
              color="default"
              aria-label="Guardar en Base de Datos"
              size="sm"
              variant="flat"
              radius="sm"
              endContent={<DBIcon className="h-auto w-4" />}
              onPress={() => {
                handleSaveInDB();
              }}
            >
              Guardar en DB
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="solid" color="default">
                  <MenuIcon className="h-auto w-5"></MenuIcon>
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="flat" aria-label="Menu de opciones">
                <DropdownItem
                  key="nuevo"
                  onPress={handleFileUpload}
                  description="Cargar un nuevo archivo comprimido"
                  startContent={
                    <AgregarArchivoIcon
                      className={cn(iconClasses, "h-auto w-5")}
                    />
                  }
                >
                  Nuevo archivo
                </DropdownItem>
                <DropdownItem
                  key="informacion"
                  showDivider
                  description="Tamaño, tipo de archivo, fecha de creación, etc."
                  startContent={
                    <InfoIcon className={cn(iconClasses, "h-auto w-5")} />
                  }
                >
                  Informacion del archivo
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
        <CardBody className="pt-0">
          <Table
            isStriped
            fullWidth
            classNames={{
              wrapper: "min-h-[700px]",
            }}
            aria-label="Tabla de archivos descomprimidos"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  loop
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  variant="flat"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                  classNames={{
                    cursor:
                      "bg-blue-950 font-bold shadow-md shadow-blue-950/50",
                  }}
                />
              </div>
            }
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "opciones" ? "end" : "start"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              //isLoading={isLoading}
              loadingContent={
                <Spinner size="lg" label="Procesando archivos ..." />
              }
              emptyContent={
                <span className="font-bold text-lg">
                  No hay archivos cargados.
                </span>
              }
              items={items}
            >
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell className="py-1">
                    <span className="font-bold text-sm text-default-500">
                      {item.id}
                    </span>
                  </TableCell>
                  <TableCell className="py-1">
                    <div className="flex items-center gap-2">
                      <ArchivoIcon className="h-auto w-10" />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-default-500">
                          {item.filename}
                        </span>
                        <Chip
                          endContent={
                            item.type == "text/plain" ? (
                              <NotificacionIcon size={13} />
                            ) : (
                              <CheckIcon size={13} />
                            )
                          }
                          color={
                            item.type == "text/plain" ? "primary" : "warning"
                          }
                          variant="flat"
                          size="sm"
                        >
                          {item.type}
                        </Chip>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-1">
                    <div className="flex flex-col">
                      <p className="text-bold text-sm capitalize text-default-500">
                        {item.mtime}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-1">
                    <Chip
                      className="capitalize"
                      color={
                        item.size <= 1000000
                          ? "success"
                          : item.size < 5000000
                          ? "warning"
                          : "danger"
                      }
                      size="sm"
                      variant="flat"
                    >
                      {item.size / 1000} KB
                    </Chip>
                  </TableCell>
                  <TableCell className="py-1">
                    <Chip
                      className="capitalize"
                      color="secondary"
                      size="sm"
                      variant="flat"
                    >
                      Complementario
                    </Chip>
                  </TableCell>
                  <TableCell className="py-1">
                    <div className="relative flex items-center gap-2">
                      <Tooltip
                        content="Editar archivo"
                        color="foreground"
                        offset={3}
                        delay={150}
                        closeDelay={150}
                      >
                        <Button
                          isIconOnly
                          color="default"
                          aria-label="Editar"
                          size="sm"
                          variant="light"
                          onPress={() => {
                            handleModifyXML(item);
                          }}
                        >
                          <EditIcon className="h-auto w-4" />
                        </Button>
                      </Tooltip>

                      <Tooltip
                        content="Eliminar archivo"
                        color="danger"
                        offset={3}
                        delay={150}
                        closeDelay={150}
                      >
                        <Button
                          onPress={() => {
                            handleDeleteXML(item);
                          }}
                          isIconOnly
                          color="danger"
                          aria-label="Editar"
                          size="sm"
                          variant="solid"
                        >
                          <DeleteIcon className="h-auto w-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal
        size="5xl"
        radius="md"
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        isDismissable={false}
        hideCloseButton={true}
        className="bg-background/65"
        classNames={{
          wrapper: "",
          base: "",
          backdrop: "",
          header: "px-3 py-3",
          body: "px-3 py-0",
          footer: "px-3",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex justify-between gap-1">
                <span className="rounded-md bg-blue-900 px-2 py-0.5 text-xl font-bold text-blue-500">
                  XML Editor
                </span>
                <div className="flex gap-2">
                  <Tooltip
                    content="Guardar cambios"
                    color="foreground"
                    offset={3}
                    delay={150}
                    closeDelay={150}
                  >
                    <Button
                      isIconOnly
                      size="sm"
                      variant="solid"
                      color="warning"
                      onPress={() => {
                        handleSaveContent();
                      }}
                    >
                      <FileCodeIcon className="h-auto w-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content="Validar XML"
                    color="foreground"
                    offset={3}
                    delay={150}
                    closeDelay={150}
                  >
                    <Button
                      isIconOnly
                      onPress={() => {
                        if (selectedItem.type === "application/xml") {
                          toast.promise(handleValidateXML(selectedFile), {
                            error: (data) => {
                              return `${data.response.data.message}`;
                            },
                            success: "XML validado exitosamente",
                            loading: "Validando archivo XML ...",
                          });
                        } else {
                          toast.success(
                            "No es necesario validar este archivo."
                          );
                        }
                      }}
                      size="sm"
                      variant="solid"
                      color="success"
                    >
                      <VerificatorIcon className="h-auto w-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content="Cerrar"
                    color="foreground"
                    offset={3}
                    delay={150}
                    closeDelay={150}
                  >
                    <Button
                      isIconOnly
                      size="sm"
                      variant="solid"
                      color="danger"
                      onPress={() => {
                        if (selectedItem.type === "application/xml") {
                          handleCloseModal();
                        } else {
                          onClose();
                        }
                      }}
                    >
                      <CerrarIcon className="h-auto w-3" />
                    </Button>
                  </Tooltip>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="overflow-hidden rounded-lg border border-gray-700">
                  <Editor
                    height="75vh"
                    width="53.5vw"
                    defaultLanguage={languajeEditor}
                    value={selectedFile}
                    onChange={(value) => {
                      setSelectedFile(value);
                    }}
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
              </ModalBody>
              <ModalFooter className="flex justify-center py-3">
                <div className="w-full">
                  <Textarea
                    isReadOnly
                    label={
                      statusXML
                        ? statusXML.toLowerCase() === "invalid"
                          ? `${statusXML.toUpperCase()} (${infoTAR.filename})`
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
                      label: "font-bold text-lg",
                      inputWrapper: "",
                      innerWrapper: "",
                      input: "",
                      description: "",
                      errorMessage: "",
                    }}
                  />
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
