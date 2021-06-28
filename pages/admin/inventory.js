import { set } from "js-cookie";
import React, { useState } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
} from "reactstrap";

// Components UI
import Modal from "../../components/Modals/modal";
// Layout Component
import Admin from "../../layouts/Admin";

export default function Inventory() {
  const [name, setName] = useState([]);
  const [type, setType] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [years, setYears] = useState([]);
  const [description, setDescription] = useState([]);

  const handleSubmit = () => {};
  return (
    <>
      <div className="container">
        <div className="text-center fs-2 fw-bold">
          <p>Inventory List</p>
        </div>
        <Modal buttonLabel="Add Inventory" className="my-2">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label forHtml="inputName" className="form-label">
                Name
              </label>
              <input
                name="name"
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="form-control"
                aria-describedby="nameHelp"
              />
              <div id="nameHelp text-muted" className="form-text">
                Input new vehicle name
              </div>
            </div>
            <div className="mb-3">
              <label forHtml="inputType" className="form-label">
                Type
              </label>
              <select className="form-select" name="type" id="">
                <option value="none" selected>
                  Select Type
                </option>
                <option value="motorcycle">Motorcycle</option>
                <option value="car">Car</option>
              </select>
            </div>
            <div className="mb-3">
              <label forHtml="inputBrand" className="form-label">
                Vehicle Brand
              </label>
              <input
                onChange={(e) => setVehicle(e.target.value)}
                type="text"
                name="brand"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label forHtml="inputYears" className="form-label">
                Years
              </label>
              <input
                onChange={(e) => setYears(e.target.value)}
                type="number"
                name="years"
                className="form-control"
                id="inputYears"
              />
            </div>
            <div className="mb-3">
              <label forHtml="inputPhoto" className="form-label">
                Photo
              </label>
              <input
                // onChange={(e) => setPhoto(e.target.value)}
                type="file"
                name="photo"
                className="form-control"
                id="inputPhoto"
              />
            </div>
            <div className="mb-3">
              <label forHtml="inputPhoto" className="form-label">
                Description
              </label>
              <textarea
                name="description"
                onChange={(e) => setDescription(e.target.value)}
                type="file"
                className="form-control"
                id="inputPhoto"></textarea>
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary mx-2">
                Submit
              </button>
              <button type="reset" className="btn btn-outline-dark mx-2">
                Clear
              </button>
            </div>
          </form>
        </Modal>
        <div className="row row-cols-md-4 row-col-lg-5">
          <div className="col">
            <Card className="mt-5">
              <CardImg
                top
                width="100%"
                src="/assets/318x180.svg"
                alt="Card image cap"
              />
              <CardBody>
                <CardTitle tag="h5">Card title</CardTitle>
                <CardSubtitle tag="h6" className="mb-2 text-muted">
                  Card subtitle
                </CardSubtitle>
                <CardText>
                  Some quick example text to build on the card title and make up
                  the bulk of the card`s content.
                </CardText>
                <Button>Button</Button>
              </CardBody>
            </Card>
          </div>
          <div className="col">
            <Card className="mt-5">
              <CardImg
                top
                width="100%"
                src="/assets/318x180.svg"
                alt="Card image cap"
              />
              <CardBody>
                <CardTitle tag="h5">Card title</CardTitle>
                <CardSubtitle tag="h6" className="mb-2 text-muted">
                  Card subtitle
                </CardSubtitle>
                <CardText>
                  Some quick example text to build on the card title and make up
                  the bulk of the card`s content.
                </CardText>
                <Button>Button</Button>
              </CardBody>
            </Card>
          </div>
          <div className="col">
            <Card className="mt-5">
              <CardImg
                top
                width="100%"
                src="/assets/318x180.svg"
                alt="Card image cap"
              />
              <CardBody>
                <CardTitle tag="h5">Card title</CardTitle>
                <CardSubtitle tag="h6" className="mb-2 text-muted">
                  Card subtitle
                </CardSubtitle>
                <CardText>
                  Some quick example text to build on the card title and make up
                  the bulk of the card`s content.
                </CardText>
                <Button>Button</Button>
              </CardBody>
            </Card>
          </div>
          <div className="col">
            <Card className="mt-5">
              <CardImg
                top
                width="100%"
                src="/assets/318x180.svg"
                alt="Card image cap"
              />
              <CardBody>
                <CardTitle tag="h5">Card title</CardTitle>
                <CardSubtitle tag="h6" className="mb-2 text-muted">
                  Card subtitle
                </CardSubtitle>
                <CardText>
                  Some quick example text to build on the card title and make up
                  the bulk of the card`s content.
                </CardText>
                <Button>Button</Button>
              </CardBody>
            </Card>
          </div>
          <div className="col">
            <Card className="mt-5">
              <CardImg
                top
                width="100%"
                src="/assets/318x180.svg"
                alt="Card image cap"
              />
              <CardBody>
                <CardTitle tag="h5">Card title</CardTitle>
                <CardSubtitle tag="h6" className="mb-2 text-muted">
                  Card subtitle
                </CardSubtitle>
                <CardText>
                  Some quick example text to build on the card title and make up
                  the bulk of the card`s content.
                </CardText>
                <Button>Button</Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

Inventory.layout = Admin;
