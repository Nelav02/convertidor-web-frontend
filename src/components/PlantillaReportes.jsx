import {
  Accordion,
  AccordionItem,
  Image,
  Divider,
  Link,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableColumn,
  TableRow,
  Spinner,
  Button,
  Chip,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import {
  getDatosAutomatizacion,
  getDatosIndividuales,
} from "../api/IndividualAPI";
import { useState } from "react";
import { FlechaAbajoIcon } from "../assets/FlechaAbajoIcon";
import { ArchivoJsonIcon } from "../assets/ArchivoJsonIcon";
import { CheckIcon } from "../assets/CheckIcon";
import { EstrallaIcon } from "../assets/EstrellaIcon";
import { ConvertirIcon } from "../assets/ConvertirIcon";

export default function PlantillaReportes() {
  // Tabla 1
  const [isLoading, setIsLoading] = useState(true);

  let list = useAsyncList({
    async load({ signal, cursor }) {
      setIsLoading(true);
      let currentPage = cursor !== undefined ? cursor : 0;

      const skip = currentPage * 5;
      const limit = 5;

      try {
        const items = await getDatosAutomatizacion(skip, limit, signal);

        const hasMore = items.length === limit;
        setIsLoading(false);

        return {
          items: items,
          cursor: hasMore ? currentPage + 1 : null,
        };
      } catch (error) {
        console.error("Error al cargar los archivos:", error);
        setIsLoading(false);
        return {
          items: [],
          cursor: null,
        };
      }
    },
  });

  const hasMore = list.cursor !== null;

  // Tabla 2
  const [isLoading2, setIsLoading2] = useState(true);

  let list2 = useAsyncList({
    async load({ signal, cursor }) {
      setIsLoading2(true);
      let currentPage2 = cursor !== undefined ? cursor : 0;

      const skip = currentPage2 * 5;
      const limit = 5;

      try {
        const items2 = await getDatosIndividuales(skip, limit, signal);
        console.log(items2);

        const hasMore2 = items2.length === limit;
        setIsLoading2(false);

        return {
          items: items2,
          cursor: hasMore2 ? currentPage2 + 1 : null,
        };
      } catch (error) {
        console.error("Error al cargar los archivos:", error);
        setIsLoading2(false);
        return {
          items: [],
          cursor: null,
        };
      }
    },
  });

  const hasMore2 = list.cursor !== null;

  function generarNumeroAleatorio() {
    const min = 3225000;
    const max = 4999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function obtenerNombreAleatorio() {
    const nombres = [
      "PRD.FML.OB673.VVI.1.240130.DATA",
      "PRD.FML.OB673.VVI.P.240130.DATA",
      "PRD.FML.OB674.LPB.1.240130.DATA",
      "PRD.FML.OB674.LPB.P.240130.DATA",
      "PRD.FML.OB735.GRU.1.240130.DATA",
      "PRD.FML.OB735.GRU.P.240130.DATA",
      "PRD.FML.OB583.SRE.1.240130.DATA",
      "PRD.FML.OB583.SRE.P.240130.DATA",
      "PRD.FML.OB235.TJA.1.240130.DATA",
      "PRD.FML.OB235.TJA.P.240130.DATA",
    ];

    const indiceAleatorio = Math.floor(Math.random() * nombres.length);
    return nombres[indiceAleatorio];
  }

  return (
    <>
      <div className="flex gap-4">
        <div className="flex-auto w-1/4 min-h-[749px] max-h-[749px] rounded-lg bg-background/25">
          <div className="min-h-[725px] max-h-[725px] mx-3 my-3 ">
            <Card fullWidth radius="sm">
              <CardHeader className="flex gap-3">
                <Image
                  alt="nextui logo"
                  height={40}
                  radius="sm"
                  src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                  width={40}
                />
                <div className="flex flex-col">
                  <p className="text-md">Archivos</p>
                  <p className="text-small text-default-500">
                    Selecciona un archivo
                  </p>
                </div>
                <div className="grid grid-cols-1 content-center pl-7">
                  <Button
                    className="text-white text-base bg-blue-950"
                    color="default"
                    aria-label="Convertir a Json"
                    size="sm"
                    variant="flat"
                    radius="sm"
                    endContent={<ConvertirIcon className="h-auto w-4" />}
                  >
                    Visualizar
                  </Button>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="min-h-[607px] max-h-[607px] overflow-auto px-0 py-0">
                <Accordion selectionMode="single" defaultExpandedKeys={["1"]}>
                  <AccordionItem
                    key="1"
                    aria-label="Archivos automatizados"
                    classNames={{
                      subtitle: "",
                      title: "font-medium underline",
                    }}
                    startContent={<EstrallaIcon className="h-auto w-8" />}
                    subtitle="Archivos guardados desde 'Editor Individual'"
                    title="Automatización"
                  >
                    <Table
                      isHeaderSticky
                      isCompact
                      radius="sm"
                      selectionMode="single"
                      color="warning"
                      bottomContent={
                        hasMore ? (
                          <div className="flex justify-center">
                            <Button
                              size="sm"
                              isDisabled={list.isLoading}
                              variant="flat"
                              onPress={list.loadMore}
                              className="bg-green-950 text-white text-sm"
                              endContent={
                                <FlechaAbajoIcon className="h-auto w-5" />
                              }
                            >
                              {list.isLoading && (
                                <Spinner color="white" size="sm" />
                              )}
                              Cargar más
                            </Button>
                          </div>
                        ) : null
                      }
                      classNames={{
                        wrapper: "px-0 py-0 min-h-[430px] max-h-[430px]",
                      }}
                    >
                      <TableHeader>
                        <TableColumn
                          key="filename"
                          className="bg-blue-950 text-white text-sm"
                        >
                          Nombre de Archivo
                        </TableColumn>
                      </TableHeader>
                      <TableBody
                        isLoading={isLoading}
                        items={list.items}
                        loadingContent={<Spinner label="Cargando..." />}
                      >
                        {(item) => (
                          <TableRow key={item._id}>
                            <TableCell className="py-1">
                              <div className="flex justify-center gap-4">
                                <div className="grid grid-cols-1 content-center">
                                  <ArchivoJsonIcon className="h-auto w-8" />
                                </div>
                                <div className="flex flex-col">
                                  <div className="text-sm font-medium">
                                    {item.filename}
                                  </div>
                                  <div className="flex justify-between">
                                    <Chip
                                      startContent={<CheckIcon size={15} />}
                                      color="warning"
                                      variant="flat"
                                      size="sm"
                                      radius="sm"
                                      className="text-xs"
                                    >
                                      {item.type}
                                    </Chip>
                                    <Chip
                                      size="sm"
                                      className="text-xs"
                                      radius="sm"
                                      color="success"
                                      variant="flat"
                                    >
                                      {item.size / 1000} KB
                                    </Chip>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </AccordionItem>
                  <AccordionItem
                    key="2"
                    aria-label="Archivos individual"
                    classNames={{
                      subtitle: "",
                      title: "font-medium underline",
                    }}
                    startContent={<EstrallaIcon className="h-auto w-8" />}
                    subtitle="Archivos guardados desde 'Paso a Paso'"
                    title="Individuales"
                  >
                    <Table
                      isHeaderSticky
                      isCompact
                      radius="sm"
                      selectionMode="single"
                      color="primary"
                      bottomContent={
                        hasMore2 ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              padding: "1rem",
                            }}
                          >
                            <Button
                              size="sm"
                              isDisabled={list2.isLoading}
                              variant="flat"
                              onPress={list2.loadMore}
                              className="bg-green-950 text-white text-sm"
                              endContent={
                                <FlechaAbajoIcon className="h-auto w-5" />
                              }
                            >
                              {list2.isLoading && (
                                <Spinner color="white" size="sm" />
                              )}
                              Cargar más
                            </Button>
                          </div>
                        ) : null
                      }
                      classNames={{
                        wrapper: "px-0 py-0 min-h-[430px] max-h-[430px]",
                      }}
                    >
                      <TableHeader>
                        <TableColumn
                          key="filename"
                          className="bg-blue-950 text-white text-sm"
                        >
                          Nombre de Archivo
                        </TableColumn>
                      </TableHeader>
                      <TableBody
                        isLoading={isLoading2}
                        items={list2.items}
                        loadingContent={<Spinner label="Cargando..." />}
                      >
                        {(item) => (
                          <TableRow key={item._id}>
                            <TableCell className="py-1">
                              <div className="flex justify-center gap-4">
                                <div className="grid grid-cols-1 content-center">
                                  <ArchivoJsonIcon className="h-auto w-8" />
                                </div>
                                <div className="flex flex-col">
                                  <div className="text-sm font-medium">
                                    {obtenerNombreAleatorio()}
                                  </div>
                                  <div className="flex justify-between">
                                    <Chip
                                      startContent={<CheckIcon size={15} />}
                                      color="primary"
                                      variant="flat"
                                      size="sm"
                                      radius="sm"
                                      className="text-xs"
                                    >
                                      application/xml
                                    </Chip>
                                    <Chip
                                      size="sm"
                                      className="text-xs"
                                      radius="sm"
                                      color="success"
                                      variant="flat"
                                    >
                                      {generarNumeroAleatorio() / 1000} KB
                                    </Chip>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </AccordionItem>
                </Accordion>
              </CardBody>
              <Divider />
              <CardFooter>
                <Link
                  isExternal
                  showAnchorIcon
                  href="https://github.com/Nelav02/convertidor-web-frontend"
                >
                  Código fuente en GitHub.
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
        <div className="flex-auto w-3/4 min-h-[749px] rounded-lg bg-background/25">
          02
        </div>
      </div>
    </>
  );
}
