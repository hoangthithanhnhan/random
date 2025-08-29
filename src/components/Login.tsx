"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { EyeOff, Eye } from "lucide-react";
import Image from "next/image";
import { color } from "motion-dom";
import { login } from "services/AuthService";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "93%",
  maxWidth: 640,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
};

export default function LoginModal() {
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"login" | "register">(
    "login"
  );

  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const [checked, setChecked] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      const data = await login(email, password);
      console.log("Login success:", data);
      handleClose();
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed");
    }
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        sx={{
          color: "#00BE7A",
          textTransform: "none",
          padding: "0",
          margin: "0",
          display: "inline",
          width: "fit-content",
          minWidth: "unset",
          textDecoration: "underline",
          marginLeft: "0.25rem",
          fontFamily: "Inter",
        }}
      >
        Login
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={style}
          className="flex flex-col justify-center items-center px-[1.5625rem]"
        >
          <h4 className="text-black text-center text-[1.25rem] font-bold py-[1.3125rem]">
            CONNECT ACCOUNT
          </h4>

          {/* Tab switch */}
          <div className="flex justify-center w-full sm:w-fit py-1 px-[0.375rem] bg-[#E6E9EC] rounded-lg my-4 mx-2">
            <div
              onClick={() => setActiveTab("login")}
              className={`flex items-center justify-center rounded-md text-xs sm:text-sm font-medium h-7 sm:h-8 w-full sm:w-40 cursor-pointer  ${
                activeTab === "login"
                  ? "bg-primary text-white"
                  : "text-[#7E7E7E]"
              }`}
            >
              Login
            </div>
            <div
              onClick={() => setActiveTab("register")}
              className={`flex items-center justify-center rounded-md text-xs sm:text-sm font-medium h-7 sm:h-8 w-full sm:w-40 cursor-pointer ${
                activeTab === "register"
                  ? "bg-primary text-white"
                  : "text-[#7E7E7E]"
              }`}
            >
              Register
            </div>
          </div>

          {/* Form */}
          {activeTab === "login" ? (
            <>
              <label className="font-bold text-xs sm:text-sm w-full mb-2">
                Email
              </label>
              <div className="bg-[#F1F1F1] py-[0.875rem] px-4 flex items-center w-full border-[#E6E9EC] rounded-md mb-3">
                <Image
                  src="/user.png"
                  alt="Email Icon"
                  width="20"
                  height="20"
                />
                <input
                  type="email"
                  placeholder="Enter email"
                  className="bg-transparent border-none outline-none ml-2 w-full"
                  value={email || ''}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <label className="font-bold text-xs sm:text-sm w-full mb-2">
                Password
              </label>
              <div className="bg-[#F1F1F1] py-[0.875rem] px-4 flex items-center w-full border-[#E6E9EC] rounded-md mb-3">
                <Image
                  src="/pass.png"
                  alt="Password Icon"
                  width="20"
                  height="20"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="bg-transparent border-none outline-none ml-2 w-full"
                  value={password || ''}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  onClick={togglePassword}
                  className="cursor-pointer w-5 h-5 "
                >
                  {showPassword ? (
                    <Eye
                      style={{
                        color: "#989CAB",
                        height: "20px",
                        width: "20px",
                      }}
                    />
                  ) : (
                    <EyeOff
                      style={{
                        color: "#989CAB",
                        height: "20px",
                        width: "20px",
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end items-center w-full mb-8">
                {/* <div className="flex items-center gap-2">
                  <input
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                  <p className="text-xs sm:text-sm">Remember login</p>
                </div> */}
                <a href="#" className="text-black text-xs sm:text-sm">
                  Forgot password?
                </a>
              </div>
              <button
                onClick={handleLogin}
                className="font-medium text-sm sm:text-[1rem] mx-5 w-full sm:w-auto py-1 sm:py-3 sm:px-32 bg-primary rounded-md border-none text-white mb-6 hover:cursor-pointer"
              >
                LOGIN
              </button>
            </>
          ) : (
            <>
              <label className="font-bold text-xs sm:text-sm w-full mb-2">
                Email
              </label>
              <div className="bg-[#F1F1F1] py-[0.875rem] px-4 flex items-center w-full border-[#E6E9EC] rounded-md mb-8">
                <Image
                  src="/user.png"
                  alt="Email Icon"
                  width="20"
                  height="20"
                />
                <input
                  type="email"
                  placeholder="Enter email to receive verification code"
                  className="bg-transparent border-none outline-none ml-2 w-full"
                />
              </div>
              <button className="font-medium text-sm sm:text-[1rem] py-1 px-0 w-full sm:w-auto sm:py-3 sm:px-32 bg-primary rounded-md border-none text-white mb-6">
                SEND CODE
              </button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}