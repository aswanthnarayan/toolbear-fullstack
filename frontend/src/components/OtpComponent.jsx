import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

const OtpComponent = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const theme = useSelector((state) => state.theme.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow only last entered digit
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Call onComplete when all fields are filled
    const otpValue = newOtp.join("");
    if (otpValue.length === length) {
      onComplete(otpValue);
    }

    // Move to next input if value is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    pasteData.split("").forEach((value, i) => {
      if (i < length) {
        newOtp[i] = value;
        if (inputRefs.current[i]) {
          inputRefs.current[i].value = value;
        }
      }
    });
    setOtp(newOtp);

    // Call onComplete if all fields are filled
    if (pasteData.length === length) {
      onComplete(pasteData);
    }

    // Focus on the next empty input or the last input
    const focusIndex = Math.min(pasteData.length, length - 1);
    inputRefs.current[focusIndex].focus();
  };

  return (
    <div className="flex justify-center gap-1 sm:gap-2 md:gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={`w-8 h-10 sm:w-10 sm:h-12 md:w-12 md:h-14 text-center text-base sm:text-lg md:text-xl font-semibold rounded-lg border-2 
            focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none
            transition-all duration-200 ${currentTheme.secondary} ${currentTheme.text}
            ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
        />
      ))}
    </div>
  );
};

export default OtpComponent;