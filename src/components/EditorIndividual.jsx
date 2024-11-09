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

  return (
    <div className="grid grid-cols-2 gap-5">
      <Card className="pt-2 pb-0 bg-background/25">
        <CardHeader className="justify-between py-1">
          <div className="flex gap-5">
            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xl font-bold text-blue-400">
              XML Editor
            </span>

            <Chip
              className="text-white"
              size="lg"
              color="default"
              variant="bordered"
              startContent={<CheckIcon size={25} />}
            >
              PRD.FML.OB234.SRE.1.230720.DATA
            </Chip>
          </div>
          <div className="flex gap-2">
            <Button
              className="text-white text-base bg-blue-950"
              color="default"
              aria-label="Convertir a Json"
              size="sm"
              variant="flat"
              radius="sm"
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
                >
                  Copiar contenido
                </DropdownItem>
                <DropdownItem
                  key="validar"
                  showDivider
                  description="Validar el archivo actual"
                  startContent={<CheckIcon className={iconClasses} />}
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
                fontSize: 14,
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
            color="success"
            labelPlacement="inside"
            defaultValue="ERROR: NextUI is a React UI library that provides a set of accessible, reusable, and beautiful components aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa."
          />
        </CardFooter>
      </Card>

      <Card className="pt-2 pb-0 bg-background/25">
        <CardHeader className="justify-between py-1">
          <div className="grid grid-cols1 gap-3">
            <span className="rounded-md bg-green-500/20 px-2 py-0.5 text-xl font-bold text-green-400">
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
              onPress={onOpen}
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
                        onPress={onClose}
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
                >
                  Copiar contenido
                </DropdownItem>
                <DropdownItem
                  key="validar"
                  showDivider
                  description="Validar el archivo actual"
                  startContent={<CheckIcon className={iconClasses} />}
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
                fontSize: 14,
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
            color="danger"
            labelPlacement="inside"
            defaultValue="ERROR: NextUI is a React UI library that provides a set of accessible, reusable, and beautiful components aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa."
          ></Textarea>
        </CardFooter>
      </Card>
    </div>
  );
}
