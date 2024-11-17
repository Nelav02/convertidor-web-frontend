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
  Tooltip,
  User,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import React, { useMemo, useState } from "react";
import { EyeIcon } from "../assets/EyeIcon";
import { EditIcon } from "../assets/EditIcon";
import { DeleteIcon } from "../assets/DeleteIcon";
import { columns, users } from "../utils/data";
import { CheckIcon } from "../assets/CheckIcon";
import { DBIcon } from "../assets/DBIcon";
import { MenuIcon } from "../assets/MenuIcon";
import { InfoIcon } from "../assets/InfoIcon";
import { EliminarDocumentoIcon } from "../assets/EliminarDocumentoIcon";
import { processarTAR } from "../api/IndividualAPI";
import { AgregarArchivoIcon } from "../assets/AgregarArchivoIcon";
import { ArchivoIcon } from "../assets/ArchivoIcon";
import { NotificacionIcon } from "../assets/NotificacionIcon";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export default function PasoAPaso() {
  const [extractedFiles, setExtractedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const [page, setPage] = useState(1);
  const rowsPerPage = 11;

  const pages = Math.ceil(extractedFiles.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return extractedFiles.slice(start, end);
  }, [page, extractedFiles]);

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    console.log("USER:", user);
    console.log("COLUMN KEY:", columnKey);
    console.log("CELL VALUE:", cellValue);

    switch (columnKey) {
      case "id":
        return (
          <span className="font-bold text-sm text-default-500">{user.id}</span>
        );

      case "nombre":
        return (
          <div className="flex items-center gap-2">
            <ArchivoIcon className="h-auto w-10" />
            <div className="flex flex-col">
              <span className="font-bold text-sm text-default-500">
                {user.filename}
              </span>
              <Chip
                endContent={
                  user.type == "text/plain" ? (
                    <NotificacionIcon size={13} />
                  ) : (
                    <CheckIcon size={13} />
                  )
                }
                color={user.type == "text/plain" ? "primary" : "warning"}
                variant="flat"
                size="sm"
              >
                {user.type}
              </Chip>
            </div>
          </div>
        );

      case "creacion":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-500">
              {user.mtime}
            </p>
          </div>
        );
      case "tamanio":
        return (
          <Chip
            className="capitalize"
            color={
              user.size <= 1000000
                ? "success"
                : user.size < 5000000
                ? "warning"
                : "danger"
            }
            size="sm"
            variant="flat"
          >
            {user.size / 1000} KB
          </Chip>
        );
      case "tipo":
        return (
          <Chip
            className="capitalize"
            color="secondary"
            size="sm"
            variant="flat"
          >
            Complementario
          </Chip>
        );
      case "opciones":
        return (
          <div className="relative flex items-center gap-2">
            <Button
              isIconOnly
              color="default"
              aria-label="Editar"
              size="sm"
              variant="light"
            >
              <EditIcon className="h-auto w-4" />
            </Button>
            <Button
              isIconOnly
              color="danger"
              aria-label="Editar"
              size="sm"
              variant="solid"
            >
              <DeleteIcon className="h-auto w-4" />
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const handleFileUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".tar.gz";
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 50 * 1024 * 1024) {
          alert(`El archivo es demasiado grande. ${file.size} bytes`);
          return;
        }

        try {
          const response = await processarTAR(file);
          setExtractedFiles(response.extracted_files);
          console.log(response.extracted_files);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fileInput.click();
  };

  return (
    <Card className="bg-background/25">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <span
            onClick={handleFileUpload}
            className="cursor-pointer rounded-md bg-green-500/20 px-2 py-0.5 text-xl font-bold text-green-400 hover:bg-green-900 active:scale-95 transition-transform duration-100"
          >
            .TAR.GZ
          </span>
          <Chip
            className="text-white"
            size="lg"
            color="default"
            variant="bordered"
            startContent={<CheckIcon size={24} />}
          >
            20230722-040016.PRD.WRH.FM.AMA.BOV.FTP.DATA.tar.gz
          </Chip>
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
              >
                Limpiar contenido
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <Table
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
                  cursor: "bg-blue-950 font-bold shadow-md shadow-blue-950/50",
                }}
              />
            </div>
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={
              <span className="font-bold text-lg">
                No hay archivos cargados.
              </span>
            }
            items={items}
          >
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell className="py-1">
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
