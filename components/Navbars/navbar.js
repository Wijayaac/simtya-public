import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

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
            height="48"
            alt="profile custom"
          />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <Link href="#">
              <a className="dropdown-item">Loan Vehicle</a>
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link href="#">
              <a className="dropdown-item">Profile</a>
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link href="#">
              <a className="dropdown-item">Logout</a>
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    </nav>
  );
}
