import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { registerUser, loginUser, googleLogin } from "../authSlice";
import { useAccessibility } from "../context/AccessibilityContext";
import LoadingBar from "react-top-loading-bar";
import { useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";



// Schemas
const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum 3 characters required"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AuthPage() {
  const { mode } = useParams(); // "login" or "signup"
  const isLogin = mode === "login";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { language } = useAccessibility();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);

  const loadingRef = useRef(null);

  useEffect(() => {
    if (loading) {
      loadingRef.current?.continuousStart();
    } else {
      loadingRef.current?.complete();
    }
  }, [loading]);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    if (isLogin) {
      dispatch(loginUser(data));
    } else {
      dispatch(registerUser(data));
    }
  };

  // Google login success handler
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google User Info:", decoded);


      dispatch(googleLogin(credentialResponse.credential));
    } catch (error) {
      console.error("JWT Decode Failed:", error);
    }
  };


  // Google login failure
  const handleGoogleFailure = () => {
    console.error("Google Login Failed");
  };

  // Friendly error message
  // const friendlyError =
  //   error && (error.message || error.response?.data?.msg || "Something went wrong. Please try again.");
  const friendlyError = error || null;

  return (
    <>
      <LoadingBar color="#2563eb" ref={loadingRef} height={3} />
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
          <LoadingBar color="#2563eb" ref={loadingRef} height={3} />
          <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6">
                <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-700 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-md inline-flex items-center gap-0.2">
                  Divyang
                  <img
                    src="https://www.svgrepo.com/show/287846/wheelchair.svg"
                    alt="chair icon"
                    className="w-10 h-15 drop-shadow-lg"
                  />
                  Sahayak
                </h1>
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name (Signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Full Name" : "पूरा नाम"}
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none ${errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                    {...register("firstName")}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === "en" ? "Email" : "ईमेल"}
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none ${errors.emailId ? "border-red-500" : "border-gray-300"
                    }`}
                  {...register("emailId")}
                />
              </div>
              {errors.emailId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.emailId.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === "en" ? "Password" : "पासवर्ड"}
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none ${errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error from server */}
            {/* {friendlyError && (
            <p className="text-red-500 text-sm mt-2 text-center font-medium">
              {friendlyError}
            </p>
            )} */}

            {/* Submit Button with Spinner */}
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center"
              disabled={loading}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              {loading
                ? "Processing..."
                : isLogin
                  ? language === "en"
                    ? "Sign In"
                    : "साइन इन करें"
                  : language === "en"
                    ? "Sign Up"
                    : "साइन अप करें"}
            </button>

          </form>

          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">
              {language === "en" ? "Or continue with" : "या जारी रखें"}
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Login Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              theme="filled_blue"
              size="large"
              text={isLogin ? "signin_with" : "signup_with"}
              shape="rectangular"
            />
          </div>

          {/* Toggle Mode */}
          <div className="text-center mt-6">
            <span className="text-sm">
              {isLogin
                ? language === "en"
                  ? "Don't have an account?"
                  : "खाता नहीं है?"
                : language === "en"
                  ? "Already have an account?"
                  : "पहले से खाता है?"}{" "}
              <NavLink
                to={isLogin ? "/auth/signup" : "/auth/login"}
                className="text-blue-600 hover:underline font-medium"
              >
                {isLogin
                  ? language === "en"
                    ? "Sign Up"
                    : "साइन अप"
                  : language === "en"
                    ? "Login"
                    : "लॉगिन"}
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}





