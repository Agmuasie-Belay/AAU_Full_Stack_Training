import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { BookOpen, X } from "lucide-react";
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post(`http://localhost:3000/auth/login`, {
        email,
        password,
      });

      const { access_token, user } = response.data;
      if (user.role === "admin" || user.role === "librarian") {
        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("username", user.username);
        localStorage.setItem("role", user.role);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-0 m-0 w-full h-screen ">
      <div className=" grid grid-cols-1 mt-6 p-6 w-[400px] mx-auto  rounded-md bg-white shadow-gray-300 shadow-sm">
        <form onSubmit={handleLogin} action="">
          <div className="flex justify-center">
            <BookOpen className="text-blue-600 w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold py-0">Library Manager System</h1>
          <p className="text-gray-500 text-[14px] pb-4">
            Sign in to your account to continue
          </p>
          <div className="flex flex-col items-start">
            <label htmlFor="email" className="font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              name="email"
              value={email}
              placeholder="Enter your username"
              className="border-1 rounded-md border-gray-300 w-full px-2 py-2 mb-4 focus:outline-blue-500 focus:ring-offset-2"
              style={{ outlineOffset: "4px" }}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="border-1 rounded-md border-gray-300 w-full px-2 py-2 mb-4 focus:outline-blue-500 focus:ring-offset-2"
              style={{ outlineOffset: "4px" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full  border-1 rounded-md p-2 font-semibold bg-black text-white hover:bg-gray-800 cursor-pointer"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
          <hr className="mt-4  border-gray-300" />
          <div className="flex flex-col text-[12px] text-gray-500">
            <div className="w-full pt-4">Test credentials</div>
            <div className="flex">
              <div className="w-1/2 text-left">Admin:</div>
              <div className="w-1/2 text-right">admin/ admin123</div>
            </div>
            <div className="flex justify-between">
              <div className="w-1/2 text-left">Librarian</div>
              <div className="w-1/2 text-right">librarian/ librarian123</div>
            </div>
          </div>
        </form>

        {showError && (
          <div className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-3 rounded shadow-lg flex items-center gap-4 z-50 animate-fade-in">
            <span>Login failed: {console.log(error)}</span>

            <button
              className="text-white hover:text-gray-300 font-bold text-lg"
              onClick={() => setShowError(false)}
            >
              <X/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
