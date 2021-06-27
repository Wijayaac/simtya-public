import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  return (
    <div className="container-fluid">
      <div className="row p-0">
        <div className="col-md-4 col-lg-4" style={{ minHeight: "80vh" }}>
          <div
            className="d-flex flex-column flex-shrink-0 p-3 text-left text-white bg-dark"
            style={{ width: "280px", minHeight: "100vh" }}>
            <Link href="/">
              <a className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <i className="mx-4 bi bi-cone-striped fs-5"></i>
                <span className="fs-4">SIMTYA</span>
              </a>
            </Link>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
              <li className="nav-item border-bottom border-white mb-4">
                <Link href="/">
                  <a className="nav-link fs-5 my-2 active" aria-current="page">
                    <i className="mx-4 bi bi-bar-chart"></i>
                    Dashboard
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="nav-link fs-5 my-2 text-white">
                    <i className="mx-4 bi bi-geo-alt-fill"></i>
                    Pickup
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="nav-link fs-5 my-2 text-white">
                    <i className="mx-4 bi bi-speedometer"></i>
                    Loan
                  </a>
                </Link>
              </li>
              <li className="border-top border-white mt-5">
                <Link href="/">
                  <a className="nav-link fs-5 my-2 text-white">
                    <i className="mx-4 bi bi-person-circle"></i>
                    Profiles
                  </a>
                </Link>
              </li>
            </ul>
            <hr />
            <div className="dropdown">
              <Link href="#">
                <a
                  className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                  id="dropdownUser1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <Image
                    src="/vercel.svg"
                    alt=""
                    width="32"
                    height="32"
                    className="rounded-circle me-2"
                  />
                  <strong>mdo</strong>
                </a>
              </Link>
              <ul
                className="dropdown-menu dropdown-menu-dark text-small shadow"
                aria-labelledby="dropdownUser1">
                <li>
                  <a className="dropdown-item" href="#">
                    New project...
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Settings
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <header className="p-3 mb-3 border-bottom col-8">
          <div className="container">
            <div className="d-flex flex-wrap align-items-end justify-content-end">
              <Link href="/">
                <a className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                  <svg
                    className="bi me-2"
                    width="40"
                    height="32"
                    role="img"
                    aria-label="Bootstrap"></svg>
                </a>
              </Link>

              <div className="dropdown text-end">
                <Link href="/">
                  <a
                    className="d-block link-dark text-decoration-none dropdown-toggle"
                    id="dropdownUser1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <Image
                      src="/vercel.svg"
                      alt="mdo"
                      width="32"
                      height="32"
                      className="rounded-circle"
                    />
                  </a>
                </Link>
                <ul
                  className="dropdown-menu text-small"
                  aria-labelledby="dropdownUser1">
                  <li>
                    <a className="dropdown-item" href="#">
                      New project...
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Settings
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Profile
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>
        <footer className="text-center bg-dark text-white-50">
          <p>
            Copyright &copy;2021, by{" "}
            <a href="https://github.com/Wijayaac" className="text-white">
              Wijaya
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
