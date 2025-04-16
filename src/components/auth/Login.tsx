import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/router";
import { LoginSectionData } from "../../data/LoginSectionData";
import { loginUser } from "../../utils/api/login";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
    errors?: string;
  }>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    setErrors({});
    setLoginError(null);

    const validation = loginSchema.safeParse(credentials);

    if (!validation.success) {
      const fieldErrors: typeof errors = {};
      validation.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as "email" | "password"] = issue.message;
      });

      setErrors(fieldErrors);
      setIsLoggingIn(false);
      return;
    }

    try {
      await loginUser(credentials, router);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrors({
          errors: "Incorrect email or password.",
        });
      } else {
        setErrors({
          general:
            error instanceof Error
              ? error.message
              : "Login failed. Please try again.",
        });
      }
      setIsLoggingIn(false);
    }
  };

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div
      className="flex h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${LoginSectionData.image2})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#242424D9] z-10" />

      {/* Content */}
      <div className="relative z-20 flex w-full justify-center items-center">
        <div className="w-[90%] sm:w-[60%] md:w-[40%] max-w-[500px] p-10 bg-[#181A1B] rounded-lg flex flex-col items-center justify-center">
          {/* Logo + Title */}
          <div className="text-center mb-4 mt-2">
            <img
              src={LoginSectionData.image}
              alt="altLogo"
              className="max-w-[60%] mx-auto mb-3"
              loading="lazy"
            />
            <h1 className="text-2xl font-bold text-white">
              {LoginSectionData.cardTitle}
            </h1>
            <p className="text-gray-400 text-xs">
              {LoginSectionData.cardDescription}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="w-[85%]">
            <div className="flex flex-col w-full">
              {/* Email */}
              <div className="mb-4">
                <label
                  className={`block mb-2 text-sm text-left ${
                    errors.email || errors.errors || errors.general
                      ? "text-red-400"
                      : "text-white"
                  }`}
                >
                  {LoginSectionData.EmailAddressTitle}
                </label>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded border text-sm bg-[#1F2123] text-white focus:outline-none ${
                    errors.email || errors.errors || errors.general
                      ? "border-red-400"
                      : "border-gray-600"
                  }`}
                />
                {(errors.email || errors.general || errors.errors) && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.email || errors.errors || errors.general}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="mb-2">
                <label
                  className={`block mb-2 text-sm text-left ${
                    errors.password || errors.errors || errors.general
                      ? "text-red-400"
                      : "text-white"
                  }`}
                >
                  {LoginSectionData.PasswordTitle}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 pr-10 rounded border text-sm bg-[#1F2123] text-white focus:outline-none ${
                      errors.password || errors.errors || errors.general
                        ? "border-red-400"
                        : "border-gray-600"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleTogglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg focus:outline-none"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
                {(errors.password || errors.errors || errors.general) && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.password || errors.errors || errors.general}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full mt-4 py-1.5 text-sm rounded-md transition ${
                isLoggingIn
                  ? "bg-[#A5C9ED] text-[#181A1B] cursor-not-allowed opacity-60"
                  : "bg-[#67ABEB] text-[#181A1B] hover:opacity-90"
              }`}
            >
              {isLoggingIn ? "Logging in..." : LoginSectionData.buttonText}
            </button>

            {/* Forgot Password */}
            <p className="text-center text-xs mt-2">
              <a
                href="/auth/forgot-password"
                className="text-[#67ABEB] hover:underline"
              >
                {LoginSectionData.forgotPassword}
              </a>
            </p>
          </form>

          {/* Footer */}
          <div className="absolute bottom-7 text-center">
            <p className="text-xs text-gray-300">
              {LoginSectionData.copyright}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
