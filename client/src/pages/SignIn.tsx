import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import QAuth from "../components/QAuth";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-3xl">Sign In</h1>
      <form onSubmit={handleSubmit} className="my-5 flex flex-col space-y-5">
        <input
          onChange={handleChange}
          className="bg-slate-200 px-2 ring-2"
          type="email"
          id="email"
          placeholder="Email"
          autoFocus
        />
        <input
          onChange={handleChange}
          className="bg-slate-200 px-2 ring-2"
          type="text"
          id="password"
          placeholder="Password"
        />
        <QAuth />
        <button
          disabled={loading}
          type="submit"
          className="bg-red-200 font-medium"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        {/* <p className="text-red-500">
          {error ? error || "Something went wrong" : ""}
        </p> */}
        <Link to="/sign-up">Sign Up</Link>
      </form>
    </div>
  );
};

export default SignIn;
