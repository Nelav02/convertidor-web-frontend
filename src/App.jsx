import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

import NavbarPage from "./components/Navbar";
import EditorIndividual from "./components/EditorIndividual";

import { Automatizacion_logo } from "./assets/Automatizacion";
import { Paso_a_paso_logo } from "./assets/Paso_a_paso_logo";
import { Individual_logo } from "./assets/Individual_logo";

function App() {
  return (
    <>
      <div className="min-h-screen bg-blue-950">
        <header>
          <NavbarPage />
        </header>
        <div className="flex w-full flex-col pt-4 px-3 ">
          <Tabs
            aria-label="Opciones"
            fullWidth={true}
            size="lg"
            radius="sm"
            color="primary"
            variant="solid"
            className="justify-center"
            classNames={{
              base: "",
              tabList: "bg-background/25 py-1.5 px-1.5",
              cursor: "bg-blue-950",
              tab: "",
              tabContent: "text-white",
              panel: "px-0 py-4",
            }}
          >
            <Tab
              key={1}
              title={
                <div className="flex items-center space-x-2">
                  <Individual_logo className="h-auto w-5" />
                  <span>Individual</span>
                </div>
              }
            >
              <EditorIndividual />
            </Tab>
            <Tab
              key={2}
              title={
                <div className="flex items-center space-x-2">
                  <Paso_a_paso_logo className="h-auto w-5" />
                  <span>Paso a paso</span>
                </div>
              }
            >
              <Card>
                <CardBody>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </CardBody>
              </Card>
            </Tab>
            <Tab
              key={3}
              title={
                <div className="flex items-center space-x-2">
                  <Automatizacion_logo className="h-auto w-5" />
                  <span>Automatizacion</span>
                </div>
              }
            >
              <Card>
                <CardBody>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum.
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default App;
