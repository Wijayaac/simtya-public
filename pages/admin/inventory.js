import axios from "axios";
import Cookies from "js-cookie";
import router from "next/router";
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
  const [brand, setBrand] = useState([]);
  const [years, setYears] = useState([]);
  const [photo, setPhoto] = useState(false);
  const [description, setDescription] = useState([]);

  const getData = async (e) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/inventory/`,
      {
        headers: {
          Authorization: Cookies.get("token"),
        },
      }
    );
    console.log(response.data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/inventory`;
      let data = new FormData();
      data.append("name", name);
      data.append("type", type);
      data.append("brand", brand);
      data.append("years", years);
      data.append("photo", photo, photo.name);
      data.append("description", description);
      const response = await axios.post(url, data, {
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "multipart/form-data",
          Authorization: Cookies.get("token"),
        },
      });
      console.log(data);
      // router.push("/admin/inventory");
    } catch (error) {
      console.log("Error inserting new vehicle", error);
    }
  };
  return (
    <>
      <div className="container">
        <button onClick={getData}>Get Data</button>
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
              <label
                forHtml="inputType"
                onChange={(e) => setType(e.target.value)}
                className="form-label">
                Type
              </label>
              <input
                name="name"
                onChange={(e) => setType(e.target.value)}
                type="text"
                className="form-control"
                aria-describedby="nameHelp"
              />
              {/* <select className="form-select" id="">
                <option value="motorcycle">Motorcycle</option>
                <option value="car">Car</option>
              </select> */}
            </div>
            <div className="mb-3">
              <label forHtml="inputBrand" className="form-label">
                Vehicle Brand
              </label>
              <input
                onChange={(e) => setBrand(e.target.value)}
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
                onChange={(e) => setPhoto(e.target.files[0])}
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
        {/* <div className="row row-cols-md-4 row-col-lg-5">
          <div className="col">
            <Card className="mt-5">
              <CardImg
                top
                width="100%"
                src="http://localhost:4000/uploads/1624934327941_logo.png"
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
          </div> */}
        {/* <div className="col">
            <Card className="mt-5">
              <CardImg
                top
                width="100%"
                src="http://localhost:4000/uploads/1624934327941_logo.png"
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
                src="http://localhost:4000/uploads/1624934327941_logo.png"
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
                src="http://localhost:4000/uploads/1624934327941_logo.png"
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
                src="http://localhost:4000/uploads/1624934327941_logo.png"
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
         */}
        {/* </div> */}
      </div>
    </>
  );
}

Inventory.layout = Admin;
