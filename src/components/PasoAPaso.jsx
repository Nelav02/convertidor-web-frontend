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

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export default function PasoAPaso() {
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const [page, setPage] = useState(1);
  const rowsPerPage = 11;

  const pages = Math.ceil(users.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users.slice(start, end);
  }, [page]);

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );

      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">
              {user.team}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip content="Delete user" color="danger">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Card className="bg-background/25">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <span className="rounded-md bg-green-500/20 px-2 py-0.5 text-xl font-bold text-green-400 hover:bg-green-900">
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
          isCompact
          fullWidth
          classNames={{
            wrapper: "min-h-[715px]",
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
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
