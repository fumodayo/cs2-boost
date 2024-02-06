import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import QAuth from "../components/QAuth";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-3xl">Sign Up</h1>
      <form onSubmit={handleSubmit} className="my-5 flex flex-col space-y-5">
        <input
          onChange={handleChange}
          className="bg-slate-200 px-2 ring-2"
          type="text"
          id="username"
          placeholder="User Name"
          autoFocus
        />
        <input
          onChange={handleChange}
          className="bg-slate-200 px-2 ring-2"
          type="email"
          id="email"
          placeholder="Email"
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
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <p className="text-red-500">{error && "Something went wrong"}</p>
        <Link to="/sign-in">Sign In</Link>
      </form>
    </div>
  );
};

export default SignUp;
