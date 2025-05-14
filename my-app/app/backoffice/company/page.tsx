"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { config } from "@/app/config";

export default function Page() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [taxCode, setTaxCode] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await axios.get(`${config.apiUrl}/company/list`);
        setName(res.data.name);
        setAddress(res.data.address);
        setPhone(res.data.phone);
        setEmail(res.data.email);
        setTaxCode(res.data.taxCode);
    }

    const handleSave = async () => {
        try {
            const payload = {
                name: name,
                address: address,
                phone: phone,
                email: email,
                taxCode: taxCode,
            };
            await axios.post(`${config.apiUrl}/company/create`, payload);
            Swal.fire({
                icon: "success",
                title: "บันทึกข้อมูลสำเร็จ",
                text: "ข้อมูลร้านค้าได้ถูกบันทึกเรียบร้อยแล้ว",
                timer: 1500,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถบันทึกข้อมูลร้านค้าได้",
                timer: 1500,
            });
        }
    };


    return (
        <div>
            <h1 className="container-header">ข้อมูลร้าน</h1>
            <div>
                <label>ชื่อร้าน</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>ที่อยู่</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <label>เบอร์โทร</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <label>อีเมล</label>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>เลขที่ผู้เสียภาษี</label>
                <input
                    type="text"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                />
                <button className="btn-save" onClick={handleSave}>
                    <i className="fas fa-save"></i>
                    บันทึกข้อมูลร้าน
                </button>
            </div>
        </div>
    );
} 