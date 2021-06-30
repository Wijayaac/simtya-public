import React from "react";
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

export default function Loan() {
  return (
    <>
      <div className="container">
        <div className="text-center fs-2 fw-bold">
          <p>Loan List</p>
        </div>
        <Modal buttonLabel="Loan Motorcycle" className="my-2">
          <form>
            <div className="mb-3">
              <label forHtml="inputName" className="form-label">
                Motorcycle
              </label>
              <select name="id_vehicle" id="" className="form-select">
                <option>Select Motorcycle</option>
                <option value="1">Vario A</option>
                <option value="2">Vario A</option>
                <option value="3">Vario A</option>
                <option value="4">Vario A</option>
              </select>
            </div>
            <div className="mb-3">
              <label forHtml="inputKmStart" className="form-label">
                Start Kilometers
              </label>
              <input
                type="number"
                name="start_km"
                className="form-control"
                id="inputKmStart"
              />
            </div>
            <div className="mb-3">
              <label forHtml="inputKmEnd" className="form-label">
                End Kilometers
              </label>
              <input
                type="number"
                name="end_km"
                className="form-control"
                id="inputKmEnd"
              />
            </div>
            <div className="mb-3">
              <label forHtml="inputYears" className="form-label">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                className="form-control"
                id="inputYears"
              />
            </div>
            <div className="mb-3">
              <label forHtml="inputYears" className="form-label">
                Finish Date
              </label>
              <input
                type="date"
                name="end_date"
                className="form-control"
                id="inputYears"
              />
            </div>
            <div className="mb-3">
              <label forHtml="inputPhoto" className="form-label">
                Description
              </label>
              <textarea
                name="description"
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
        </div>
      </div>
    </>
  );
}

Loan.layout = Admin;
