import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import { LoginSectionData } from "../../data/LoginSectionData";

const EmailVerification = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(true);
  const correctOTP = "123456";
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpVerified, setIsOTPVerified] = useState(false);
  const [userEmail, setUserEmail] = useState("example@email.com");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setIsButtonDisabled(otp.some((digit) => digit === ""));
  }, [otp]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleNavigation = () => {
    setIsLoading(true);
    setIsOtpValid(true);
    setIsOTPVerified(false);

    setTimeout(() => {
      setIsLoading(false);
      if (otp.join("") === correctOTP) {
        setIsOTPVerified(true);
        router.push("/set-password"); 
      } else {
        setIsOtpValid(false);
      }
    }, 2000);
  };

  const VerifyEmailDescription = (userEmail: string) => {
    return {
      EmailVerificationDescription: `We have sent a verification code to ${userEmail}. Please check your email and enter the code below.`,
    };
  };

  useEffect(() => {
    setIsOtpValid(true);
  }, [otp]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center lg:items-stretch lg:flex-row bg-[#F8F0E3]">
      <div className="w-full lg:flex-1 flex flex-col justify-center items-center py-8 px-4 lg:py-0">
        <div className="text-center w-full max-w-md">
          <div className="flex justify-center gap-3 mb-4">
            <img
              src={LoginSectionData.image2}
              alt="PCSO Logo"
              className="w-[35%] max-w-[150px] lg:max-w-[180px]"
              loading="lazy"
            />
            <img
              src={LoginSectionData.image}
              alt="STL Logo"
              className="w-[35%] max-w-[120px] lg:max-w-[180px]"
              loading="lazy"
            />
          </div>
          <h1 className="text-base md:text-xl font-bold text-[#0038A8]">
            {LoginSectionData.logoTitle}
          </h1>
          <p className="text-[#0038A8] text-sm">
            {LoginSectionData.logoDescription}
          </p>
        </div>
      </div>

      <div className="w-full lg:flex-1 flex flex-col justify-center items-center px-4 pb-16 lg:pb-0 relative">
        <div className="w-full max-w-md">
          <div className="relative">
            <div
              className="mb-6 inline-block"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <a
                href="/"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#0038A8]"
              >
                <FaArrowLeft className="text-[#F8F0E3]" />
              </a>
              {showTooltip && (
                <div className="absolute left-12 top-2 bg-[#0038A8] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Back to Login
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-800"></div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full max-w-md">
            <div className="flex justify-center flex-col mb-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-[#0038A8]">
                {LoginSectionData.forgotPasswordTitle}
              </h1>
              <p className="text-[#0038A8] text-sm mt-2">
                {LoginSectionData.forgotPasswordDescription}
              </p>
            </div>

            {!isOtpVerified && (
              <p className="text-[#0038A8] text-xs text-justify">
                {userEmail &&
                  VerifyEmailDescription(userEmail)
                    .EmailVerificationDescription}
              </p>
            )}

            {isLoading && (
              <div className="fixed inset-0 z-50 bg-[#212121]/70 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {!isOtpVerified && (
              <div className="flex justify-center mt-7">
                <div className="grid grid-cols-6 gap-2 w-full">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleBackspace(e, index)}
                      maxLength={1}
                      className={`text-center text-3xl font-extrabold aspect-square w-full rounded-md outline-none bg-transparent border ${
                        digit
                          ? "border-[#0038A8]"
                          : !otp.every((d) => d !== "")
                            ? "border-[#ACA993]"
                            : isOtpValid
                              ? "border-[#ACA993]"
                              : "border-[#CE1126]"
                      } focus:border-[#0038A8]`}
                    />
                  ))}
                </div>
              </div>
            )}

            {!isOtpValid && (
              <p className=" text-[#CE1126] mt-2 text-sm">
                Invalid OTP. Please check your email and enter the correct OTP.
              </p>
            )}

            {!isOtpVerified && (
              <button
                onClick={handleNavigation}
                className={`w-full mt-4 py-2 text-sm rounded-md transition bg-[#F6BA12] text-[#212121] hover:opacity-70 ${isButtonDisabled ? "bg-[#F6BA12] text-[#212121] cursor-not-allowed opacity-50" : "bg-[#F6BA12] text-[#212121] cursor-pointer"}`}
                disabled={isButtonDisabled}
              >
                {LoginSectionData.resetPasswordButton}
              </button>
            )}

            {!isOtpVerified && (
              <p className="text-[#0038A8] text-center text-xs mt-4">
                {LoginSectionData.resendEmailDescription}
              </p>
            )}
          </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 text-center px-4 lg:bottom-8">
          <p className="text-xs text-[#0038A8]">{LoginSectionData.copyright}</p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
