import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// Utils lib
import { logout } from "../../utils/auth";

export default function Navbar() {
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!dropdownOpen);
  };
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light
    
    border-bottom justify-content-end">
      <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret color="outline-white">
          <Image
            src="/vercel.svg"
            width="48"
            height="24"
            alt="profile custom"
          />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <Button color="outline-dark" onClick={logout} block>
              Logout
            </Button>
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    </nav>
  );
}
