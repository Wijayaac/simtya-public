import React, { useEffect, useState } from "react";
import router from "next/router";
import Image from "next/image";
import axios from "axios";

// utils auth library
import { HandleMemberSSR } from "../../utils/auth";

// components layout
import ArticlePlaceholder from "../../components/Skeleton/ArticlePlaceholder";

// layouts
import Admin from "../../layouts/Admin";
import { parseJWT } from "../../utils/parseJWT";

export async function getServerSideProps(ctx) {
  const token = await HandleMemberSSR(ctx);

  const { sub } = parseJWT(token);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/member/profile/${sub}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: token,
    },
  });
  return {
    props: {
      token: token,
      user: response.data.data,
    },
  };
}

export default function VehicleEdit(props) {
  const { user } = props;
  const id = user.id;
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [photo, setPhoto] = useState(user.photo);
  const [description, setDescription] = useState(user.description);
  const [preview, setPreview] = useState(
    `${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.photo}`
  );
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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/member/profile`;
    let data = "";
    if (photo) {
      data = ImageInserted();
    } else {
      data = ImageNotInserted();
    }
    data.append("id", id);
    data.append("name", name);
    data.append("email", email);
    data.append("username", username);
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
      })
      .catch((error) => {
        setLoading(true);
        console.log("Error updating new vehicle", error);
      });
  }
  const handleBack = () => {
    router.push("/member");
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
      <div className="container row row-cols-md-2 gutters">
        {isLoading && (
          <div className="col-6">
            <ArticlePlaceholder />
          </div>
        )}
        {!isLoading && (
          <div className="col-6">
            <div className="d-flex flex-row justify-content-between mt-3">
              <p className="fs-3 fw-bold">Edit Profile</p>
              <button onClick={handleBack.bind(this)} className="btn btn-info">
                <i className="bi bi-arrow-left-circle"></i> Back to Dashboard
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label forHtml="inputName" className="form-label">
                  Name
                </label>
                <input
                  placeholder="who are you ?"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label forHtml="inputEmail" className="form-label">
                  Email
                </label>
                <input
                  placeholder="who are you ?"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label forHtml="inputUsername" className="form-label">
                  Username
                </label>
                <input
                  placeholder="your first name"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  className="form-control"
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
                </div>
              </div>
              <div className="mb-3">
                <label forHtml="inputPhoto" className="form-label">
                  About you
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
                  {isLoading && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"></span>
                  )}
                  {!isLoading && <span>Save</span>}
                </button>
                <button type="reset" className="btn btn-outline-dark mx-2">
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="col-6">
          <div className="card card-custom mt-4">
            <div className="card-body">
              <div className="account-settings">
                <div className="user-profile">
                  <div className="user-avatar text-center">
                    {photo && (
                      <Image
                        className="ms-1"
                        src={preview}
                        height="256"
                        width="256"
                        alt="image-preview"
                      />
                    )}
                    {!photo && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="256"
                        height="256"
                        fill="currentColor"
                        className="bi bi-person-bounding-box"
                        viewBox="0 0 16 16">
                        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z" />
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      </svg>
                    )}
                  </div>
                  <h5 className="user-name">{name}</h5>
                  <h6 className="user-email">{email}</h6>
                </div>
                <div className="about">
                  <h5>About</h5>
                  <p>{description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

VehicleEdit.layout = Admin;
