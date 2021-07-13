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
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom justify-content-end">
      <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret color="outline-white">
          Menu
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <a
              onClick={logout}
              type="button"
              className="btn btn-outline-dark btn-lg">
              Logout
            </a>
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    </nav>
  );
}
