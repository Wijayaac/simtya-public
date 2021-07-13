import React, { useEffect, useState } from "react";
import axios from "axios";
import router from "next/router";
import Image from "next/image";

import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "reactstrap";

// Components UI
import Modal from "../../../components/Modals/";
import ArticlePlaceholder from "../../../components/Skeleton/ArticlePlaceholder";
// Layout Component
import Admin from "../../../layouts/Admin";
import { HandleAdminSSR } from "../../../utils/auth";

export async function getServerSideProps(ctx) {
  const token = await HandleAdminSSR(ctx);
  return {
    props: {
      token: token,
    },
  };
}
export default function Inventory(props) {
  const { token } = props;
  const [name, setName] = useState([]);
  const [type, setType] = useState([]);
  const [brand, setBrand] = useState([]);
  const [km, setKm] = useState(0);
  const [now, setNow] = useState(0);
  const [years, setYears] = useState([]);
  const [photo, setPhoto] = useState(false);
  const [preview, setPreview] = useState("/vercel.svg");
  const [description, setDescription] = useState([]);
  const [data, setData] = useState([
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
  ]);
  const [isLoading, setLoading] = useState(true);
  const [searchTerms, setSearchTerms] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/inventory/`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/inventory`;
    let data = new FormData();
    data.append("name", name);
    data.append("type", type);
    data.append("brand", brand);
    data.append("km", km);
    data.append("now", now);
    data.append("years", years);
    data.append("photo", photo, photo.name);
    data.append("description", description);
    axios
      .post(url, data, {
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      })
      .then((res) => {
        setLoading(false);
        router.reload();
      })
      .catch((error) => {
        setLoading(true);
        console.log("Error inserting new vehicle", error);
      });
  };
  const handleDetail = (id) => {
    router.push(`/admin/inventory/detail/${id}`);
  };
  const handleDelete = (id) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/inventory/${id}`;
    axios
      .delete(url, {
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: token,
        },
      })
      .then(() => {
        router.reload();
      })
      .catch((err) => console.log(err));
  };
  const onImageChange = (e) => {
    setPhoto(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  return (
    <>
      <div className="container">
        <div className="text-center fs-2 fw-bold">
          <p>Inventory List</p>
        </div>
        <div className="d flex d-flex-column justify-content-end">
          <input
            className="p-2 border border-dark rounded"
            type="search"
            placeholder="Search vehicle name"
            onChange={(e) => setSearchTerms(e.target.value)}
          />
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
              <select
                nam="type"
                onChange={(e) => setType(e.target.value)}
                className="form-select"
                required>
                <option selected>Select one Type</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="car">Car</option>
              </select>
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
              <label forHtml="inputBrand" className="form-label">
                Vehicle Kilometer
              </label>
              <input
                onChange={(e) => setKm(e.target.value)}
                type="number"
                name="km"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label forHtml="inputBrand" className="form-label">
                Actual Kilometer
              </label>
              <input
                onChange={(e) => setNow(e.target.value)}
                type="number"
                name="now"
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
              <div className="d-flex flex-row justify-content-around align-items-center">
                <input
                  onChange={(e) => {
                    onImageChange(e);
                  }}
                  type="file"
                  name="photo"
                  className="form-control me-1"
                  id="inputPhoto"
                  required
                />
                <Image
                  id="target"
                  className="img-thumbnail ms-1"
                  width="100"
                  height="100"
                  src={preview}
                  alt="new image"
                />
              </div>
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
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isLoading}>
                {isLoading && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"></span>
                )}
                {!isLoading && <span>Submit</span>}
              </button>
              <button type="reset" className="btn btn-outline-dark mx-2">
                Clear
              </button>
            </div>
          </form>
        </Modal>
        {isLoading && (
          <div className="row row-cols-md-4 row-col-lg-5">
            {data.map((item) => {
              return (
                <div className="col" key={item.id}>
                  <Card className="mt-5">
                    <CardBody>
                      <ArticlePlaceholder />
                    </CardBody>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
        {!isLoading && (
          <div className="row row-cols-md-4 row-col-lg-5">
            {data
              .filter((vehicle) => {
                if (searchTerms === "") {
                  return vehicle;
                } else if (
                  vehicle.name.toLowerCase().includes(searchTerms.toLowerCase())
                ) {
                  return vehicle;
                }
              })
              .map((vehicle) => {
                return (
                  <div key={vehicle.id} className="col">
                    <Card className="mt-5">
                      <CardImg
                        width="100px"
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${vehicle.photo}`}
                        alt="Card image cap"
                      />
                      <CardBody>
                        <CardTitle tag="h5">{vehicle.name}</CardTitle>
                        <CardSubtitle tag="h6" className="mb-3 text-muted">
                          {vehicle.type}
                        </CardSubtitle>
                        <button
                          type="button"
                          onClick={handleDetail.bind(this, vehicle.id)}
                          className="btn btn-warning mx-2">
                          <i className="bi bi-pencil me-1"></i>
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={handleDelete.bind(this, vehicle.id)}
                          className="btn btn-danger mx-2">
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>
                      </CardBody>
                    </Card>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
}

Inventory.layout = Admin;
