import React, { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// Utils lib
import { logout } from "../../utils/auth";
import { parseJWT } from "../../utils/parseJWT";

export default function Navbar() {
  const [dropdownOpen, setOpen] = useState(false);
  const [name, setName] = useState(null);
  const [role, setRole] = useState(null);
  const toggle = () => {
    setOpen(!dropdownOpen);
  };

  useEffect(() => {
    const token = Cookies.get("token");
    const { role } = parseJWT(token);
    setRole(role);
    if (role === 1) {
      setName("admin");
    } else if (role === 2) {
      setName("driver");
    } else {
      setName("member");
    }
    return () => {};
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom justify-content-end">
      <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret color="outline-white">
          Menu
        </DropdownToggle>
        <DropdownMenu>
          <div className="nav-mobile">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <Link href={`/${name}`}>
                  <a className="nav-item ms-3" aria-current="page">
                    <i className="bi bi-bar-chart"></i>
                    Dashboard
                  </a>
                </Link>
              </li>
            </ul>
            <hr />
            {(() => {
              switch (role) {
                case 1:
                  return (
                    <ul className="nav">
                      <li>
                        <DropdownItem>
                          <Link href={`/${name}/pickup`}>
                            <a>
                              <i className="bi bi-geo-alt-fill"></i> Pickup
                            </a>
                          </Link>
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem>
                          <Link href={`/${name}/service`}>
                            <a>
                              <i className="bi bi-speedometer"></i> Service
                            </a>
                          </Link>
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem>
                          <Link href={`/${name}/inventory`}>
                            <a>
                              <i className="bi bi-truck"></i> Inventory
                            </a>
                          </Link>
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem>
                          <Link href={`/${name}/loan`}>
                            <a>
                              <i className="bi bi-bicycle"></i> Loan
                            </a>
                          </Link>
                        </DropdownItem>
                      </li>
                    </ul>
                  );
                case 2:
                  return (
                    <ul className="nav nav-pills">
                      <li>
                        <DropdownItem>
                          <Link href={`/${name}/pickup`}>
                            <a>
                              <i className="bi bi-geo-alt-fill"></i> Pickup
                            </a>
                          </Link>
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem>
                          <Link href={`/${name}/service`}>
                            <a>
                              <i className="bi bi-speedometer"></i> Service
                            </a>
                          </Link>
                        </DropdownItem>
                      </li>
                    </ul>
                  );
                case 3:
                  return (
                    <ul className="nav nav-pills">
                      <li>
                        <DropdownItem>
                          <Link href={`/${name}/pickup`}>
                            <a>
                              <i className="bi bi-geo-alt-fill"></i> Pickup
                            </a>
                          </Link>
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem>
                          <Link href={`/${name}/loan`}>
                            <a>
                              <i className="bi bi-bicycle"></i> Loan
                            </a>
                          </Link>
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem>
                          <Link href={`/${name}/profile`}>
                            <a>
                              <i className="bi bi-person-circle"></i> Profile
                            </a>
                          </Link>
                        </DropdownItem>
                      </li>
                    </ul>
                  );
                default:
                  break;
              }
            })()}
          </div>
          <hr />
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
