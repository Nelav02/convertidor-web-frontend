import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  //NavbarItem,
  //Link,
  //Input,
} from "@nextui-org/react";
//import { SearchIcon } from "../assets/SearchIcon.jsx";
import { BOA_logo } from "../assets/BOA_logo.jsx";

export default function NavbarPage() {
  return (
    <Navbar isBlurred={false} height="5rem" maxWidth="2xl" position="sticky">
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <BOA_logo className="h-auto w-36" />
        </NavbarBrand>
        {/*<NavbarContent className="hidden sm:flex gap-3">
          <NavbarItem isActive>
            <Link color="primary" href="#">
              Funcionalidad
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Reportes
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          startContent={<SearchIcon size={20} />}
          type="search"
        />*/}
      </NavbarContent>
    </Navbar>
  );
}
