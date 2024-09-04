import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);
  console.log("avatar", avatar);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log("formdata: ", formData);
    const { username, email, password } = Object.fromEntries(formData);
    console.log(username, email, password);
    // console.log("fromENtries: ", Object.fromEntries(formData));
    // console.log("currentUser", currentUser);

    try {
      let response = await fetch(
        `http://localhost:3210/api/users/${currentUser._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json", // Ensure the Content-Type is set for JSON
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            avatar: avatar[0],
          }),
        }
      );
      if (!response.ok) {
        const ErrorData = await response.json();
        throw new Error(ErrorData.message || "Something went wrong");
      }
      const result = await response.json();

      updateUser(result);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };
  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button>Update</button>
          {error && <span>{error}</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img
          src={avatar[0] || currentUser.avatar || "/noavatar.jpg"}
          alt=""
          className="avatar"
        />
        <UploadWidget
          uwConfig={{
            cloudName: "rawatdev",
            uploadPreset: "estate",
            multiple: false,
            maxImageSize: 2000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
