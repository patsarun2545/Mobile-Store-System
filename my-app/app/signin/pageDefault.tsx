"use client";

import { useState } from "react";
import { config } from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const payload = {
        username: username,
        password: password,
      }
      const response = await axios.post(`${config.apiUrl}/user/signin`, payload)

      if (response.data.token !== null) {
        localStorage.setItem("token", response.data.token)
        router.push("/backoffice/dashboard")
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
          text: 'ตรวจสอบ username หรือ password',
          timer: 2000,
        })
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response.data.message,
        timer: 2000,
      })
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-200 via-teal-300 to-teal-400">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Sign In
        </h1>

        <div className="mb-1">
          <label className="block text-gray-700 font-semibold mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <button
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          onClick={handleSignIn}
        >
          Sign In
          <i className="fas fa-sign-in-alt ml-2"></i>
        </button>
      </div>
    </div>
  );
}
