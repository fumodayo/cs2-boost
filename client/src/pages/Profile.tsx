import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
} from "../redux/user/userSlice";
import { app } from "../utils/firebase";

const Profile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profilePicture: downloadURL });
        });
      },
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <input
        type="file"
        ref={fileRef}
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        hidden
      />
      {currentUser.profilePicture && (
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="avatar"
          className="h-24 w-24"
          onClick={() => fileRef.current.click()}
        />
      )}
      <p className="self-center text-sm">
        {imageError ? (
          <span className="text-red-700">
            Error uploading image (file size must be less than 2 MB)
          </span>
        ) : imagePercent > 0 && imagePercent < 100 ? (
          <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
        ) : imagePercent === 100 ? (
          <span className="text-green-700">Image uploaded successfully</span>
        ) : (
          ""
        )}
      </p>
      <input
        defaultValue={currentUser.username}
        type="text"
        id="username"
        placeholder="Username"
        onChange={handleChange}
      />
      <input
        defaultValue={currentUser.email}
        type="text"
        id="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        defaultValue={currentUser.password}
        type="text"
        id="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <button type="submit" className="bg-green-500">
        {loading ? "Loading..." : "Update"}
      </button>
      <button onClick={handleDeleteAccount} className="bg-blue-500">
        Delete Account
      </button>
      <button className="bg-red-500">Sign Out</button>
      <p className="text-red-500">{error && "Something went wrong"}</p>
      <p className="text-green-500">
        {updateSuccess && "User is updated successfully!"}
      </p>
    </form>
  );
};

export default Profile;
