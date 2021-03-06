import React, { useEffect, useState } from "react";
import router from "next/router";
import Image from "next/image";
import axios from "axios";
import moment from "moment";

// utils auth library
import { HandleAdminSSR } from "../../../../utils/auth";

// components layout
import FormPlaceholder from "../../../../components/Skeleton/FormPlaceholder";
import HistoryPlaceholder from "../../../../components/Skeleton/HistoryPlaceholder";
// layouts
import Admin from "../../../../layouts/Admin";

export async function getServerSideProps(ctx) {
  const token = await HandleAdminSSR(ctx);

  const { id } = ctx.query;

  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/inventory/${id}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: token,
    },
  });
  return {
    props: {
      token: token,
      vehicle: response.data,
    },
  };
}

export default function VehicleEdit(props) {
  const { data } = props.vehicle;
  const [id, setId] = useState(data[0].id);
  const [photo, setPhoto] = useState();
  const [preview, setPreview] = useState(
    `${process.env.NEXT_PUBLIC_API_URL}/uploads/${data[0].photo}`
  );
  const [name, setName] = useState(data[0].name);
  const [brand, setBrand] = useState(data[0].brand);
  const [plate, setPlate] = useState(data[0].plate);
  const [km, setKm] = useState(data[0].km);
  const [now, setNow] = useState(data[0].now_km);
  const [type, setType] = useState(data[0].type);
  const [years, setYears] = useState(data[0].years);
  const [description, setDescription] = useState(data[0].description);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const ImageInserted = () => {
    let data = new FormData();
    data.append("photo", photo, photo.name);
    return data;
  };
  const ImageNotInserted = () => {
    let data = new FormData();
    return data;
  };

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { token } = props;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/inventory`;
    let data = "";
    if (photo) {
      data = ImageInserted();
    } else {
      data = ImageNotInserted();
    }
    data.append("id", id);
    data.append("name", name);
    data.append("plate", plate);
    data.append("brand", brand);
    data.append("km", km);
    data.append("now", now);
    data.append("type", type);
    data.append("years", years);
    data.append("description", description);

    axios
      .put(url, data, {
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      })
      .then(() => {
        setLoading(false);
        router.push("/admin/inventory");
      })
      .catch((error) => {
        setLoading(true);
        console.log("Error updating new vehicle", error);
      });
  }
  const handleBack = () => {
    router.push("/admin/inventory");
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
      <div className="container row row-cols-md-2">
        {isLoading && (
          <div className="col">
            <FormPlaceholder />
          </div>
        )}
        {!isLoading && (
          <div className="col">
            <div className="d-flex flex-row justify-content-between mt-3">
              <p className="fs-3 fw-bold">Edit Inventory</p>
              <button onClick={handleBack.bind(this)} className="btn btn-info">
                <i className="bi bi-arrow-left-circle"></i> Back to Inventory
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label forHtml="inputName" className="form-label">
                  Name
                </label>
                <input
                  name="name"
                  value={name}
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
                  className="form-select"
                  name="type"
                  onChange={(e) => setType(e.target.value)}>
                  <option selected>{type ? type : "Please Select One"}</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="car">Car</option>
                </select>
              </div>
              <div className="mb-3">
                <label forHtml="inputPlate" className="form-label">
                  Vehicle Plate
                </label>
                <input
                  defaultValue={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  type="text"
                  name="plate"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label forHtml="inputBrand" className="form-label">
                  Vehicle Brand
                </label>
                <input
                  defaultValue={brand}
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
                  value={km}
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
                  value={now}
                  name="now"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label forHtml="inputYears" className="form-label">
                  Years
                </label>
                <input
                  defaultValue={years}
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
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <input
                    onChange={(e) => onImageChange(e)}
                    type="file"
                    className="form-control me-1"
                    id="inputPhoto"
                    name="photo"
                  />
                  <Image
                    className="ms-1"
                    src={preview ? preview : "/vercel.svg"}
                    height="100"
                    width="100"
                    alt="image-preview"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label forHtml="inputPhoto" className="form-label">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="file"
                  className="form-control"
                  id="inputPhoto"></textarea>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary mx-2"
                  disabled={isLoading}>
                  {isLoading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"></span>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
                <button type="reset" className="btn btn-outline-dark mx-2">
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="col">
          <div className="d-flex flex-row justify-content-center mt-3">
            <p className="fs-3 fw-bold">
              <i className="bi bi-clock-history me-5"></i>History
            </p>
          </div>
          {isLoading && (
            <div className="d-flex justify-content-center">
              <HistoryPlaceholder />
            </div>
          )}
          {!isLoading && (
            <div
              className="d-flex flex-row overflow-auto"
              style={{ height: "80vh" }}>
              <div id="content">
                <ul className="timeline ">
                  <li
                    className="event"
                    data-date={moment(data[0].updated_at).format(
                      "DD,MMM, YYYY"
                    )}>
                    <h3>Last Update</h3>
                    <p>
                      <br />
                      <span>Kilometers: {km}</span>
                      <br />
                      <br />
                      <span>
                        Added to Inventory:
                        {moment(data[0].created_at).format("DD MMM,YY H:mm A")}
                      </span>
                      <br />
                      <br />
                      Info :{description}
                      <br />
                      <small className="text-muted">
                        NOTE: description of events that occur from this vehicle
                        loan, can be in the form of accidents, or incidents such
                        as damage that occurs. You can view the report here and
                        see in detail.
                      </small>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

VehicleEdit.layout = Admin;
