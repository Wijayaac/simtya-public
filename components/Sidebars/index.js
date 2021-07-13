import React, { Component } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

// utils
import { parseJWT } from "../../utils/parseJWT";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: null,
      name: null,
    };
  }
  componentDidMount = () => {
    const token = Cookies.get("token");
    const { role } = parseJWT(token);
    if (role === 1) {
      this.setState({ name: "admin" });
    } else if (role === 2) {
      this.setState({ name: "driver" });
    } else {
      this.setState({ name: "member" });
    }
    this.setState({
      role,
    });
  };
  render() {
    return (
      <div className="bg-dark border-right fixed" id="sidebar-wrapper">
        <div className="sidebar-heading text-center text-white py-5">
          <i className="bi bi-cone-striped"></i> SIMTYA
        </div>

        <div className="list-group list-group-flush">
          {/* <!-- Get menu from @menu params ^^^ --> */}
          <ul className="nav nav-pills flex-column mb-auto border-bottom border-white">
            <li className="nav-item mb-4">
              <Link href={`/${this.state.name}`}>
                <a
                  className="nav-link fs-5 my-2 text-white"
                  aria-current="page">
                  <i className="mx-4 bi bi-bar-chart"></i>
                  Dashboard
                </a>
              </Link>
            </li>
          </ul>

          {(() => {
            switch (this.state.role) {
              case 1:
                return (
                  <>
                    <ul className="nav nav-pills flex-column mb-auto">
                      <li>
                        <Link href={`/${this.state.name}/pickup`}>
                          <a className="nav-link fs-5 my-2 text-white">
                            <i className="mx-4 bi bi-geo-alt-fill"></i>
                            Pickup
                          </a>
                        </Link>
                      </li>
                      <hr className="text-white-50" />
                      <li>
                        <Link href={`/${this.state.name}/loan`}>
                          <a className="nav-link fs-5 my-2 text-white">
                            <i className="mx-4 bi bi-bicycle"></i>
                            Loan
                          </a>
                        </Link>
                      </li>
                      <hr className="text-white-50" />
                      <li>
                        <Link href={`/${this.state.name}/service`}>
                          <a className="nav-link fs-5 my-2 text-white">
                            <i className="mx-4 bi bi-speedometer"></i>
                            Service
                          </a>
                        </Link>
                      </li>
                      <hr className="text-white-50" />
                      <li className="border-top border-white mt-5">
                        <Link href={`/${this.state.name}/inventory`}>
                          <a className="nav-link fs-5 my-2 text-white">
                            <i className="mx-4 bi bi-truck"></i>
                            Inventory
                          </a>
                        </Link>
                      </li>
                      <hr className="text-white-50" />
                    </ul>
                  </>
                );
              case 2:
                return (
                  <>
                    <ul className="nav nav-pills flex-column mb-auto">
                      <li>
                        <Link href={`/${this.state.name}/pickup`}>
                          <a className="nav-link fs-5 my-2 text-white">
                            <i className="mx-4 bi bi-geo-alt-fill"></i>
                            Pickup
                          </a>
                        </Link>
                      </li>
                      <hr className="text-white-50" />
                      <li>
                        <Link href={`/${this.state.name}/service`}>
                          <a className="nav-link fs-5 my-2 text-white">
                            <i className="mx-4 bi bi-speedometer"></i>
                            Service
                          </a>
                        </Link>
                      </li>
                      <hr className="text-white-50" />
                    </ul>
                  </>
                );
              case 3:
                return (
                  <>
                    <ul className="nav nav-pills flex-column mb-auto">
                      <li>
                        <Link href={`/${this.state.name}/pickup`}>
                          <a className="nav-link fs-5 my-2 text-white">
                            <i className="mx-4 bi bi-geo-alt-fill"></i>
                            Pickup
                          </a>
                        </Link>
                      </li>
                      <hr className="text-white-50" />
                      <li>
                        <Link href={`/${this.state.name}/loan`}>
                          <a className="nav-link fs-5 my-2 text-white">
                            <i className="mx-4 bi bi-bicycle"></i>
                            Loan
                          </a>
                        </Link>
                      </li>
                      <hr className="text-white-50" />
                      <li>
                        <Link href={`/${this.state.name}/profile`}>
                          <a className="nav-link fs-5 my-2 text-white">
                            <i className="mx-4 bi bi-person-circle"></i>
                            Profile
                          </a>
                        </Link>
                      </li>
                      <hr className="text-white-50" />
                    </ul>
                  </>
                );
              default:
                break;
            }
          })()}
        </div>
      </div>
    );
  }
}
