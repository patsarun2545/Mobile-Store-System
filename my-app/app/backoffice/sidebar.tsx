'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import { config } from "../config";
import Link from "next/link";
import Modal from "./modal";
import Cookies from 'js-cookie';

export default function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [name, setName] = useState("");
    const [level, setLevel] = useState("");
    const [isOpenModal, setisOpenModal] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const token = Cookies.get("token");

    const toggleSidebar = () => setIsExpanded(!isExpanded);
    const router = useRouter();

    const handleOpenModal = () => {
        setisOpenModal(true);
    }

    const handleCloseModal = () => {
        setisOpenModal(false);
    }

    useEffect(() => {
        fatchData();
    }, []);

    const fatchData = async () => {
        const token = Cookies.get("token");
        const headers = {
            Authorization: `Bearer ${token}`,
        }
        const res = await axios.get(`${config.apiUrl}/user/info`, { headers: headers });
        setName(res.data.name);
        setUsername(res.data.username);
        setLevel(res.data.level);
    }

    const handleLogout = async () => {
        Cookies.remove("token");
        Swal.fire({
            icon: "success",
            title: "ออกจากระบบ",
            text: "ออกจากระบบสำเร็จ",
            timer: 1500,
            showConfirmButton: false,
        });
        router.push("/");
    }

    const handleSave = async () => {
        if (password !== confirmpassword) {
            Swal.fire({
                icon: "error",
                title: "รหัสผ่านไม่ตรงกัน",
                text: "กรุณาตรวจสอบรหัสผ่านอีกครั้ง",
            });
            return;
        }

        const payload = {
            name: name,
            username: username,
            password: password || "",
            level: level,
        }

        const token = Cookies.get("token");
        const headers = {
            Authorization: `Bearer ${token}`
        }
        try {
            await axios.put(`${config.apiUrl}/user/update`, payload, { headers: headers });
            Swal.fire({
                icon: "success",
                title: "บันทึกข้อมูล",
                text: "บันทึกข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
            })
            fatchData();
            handleCloseModal();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
            });
        }
    }

    return (
        <div
            className={`relative bg-teal-400 ${isExpanded ? "w-64" : "w-20"
                } flex flex-col transition-all duration-300 h-screen`}
        >
            {/* ปุ่มย่อ/ขยาย */}
            <button
                onClick={toggleSidebar}
                className="absolute top-7 right-[-12px] z-10 bg-white text-teal-600 border border-teal-600 p-2 rounded-full hover:bg-teal-100 transition"
            >
                <i
                    className={`fas ${isExpanded ? "fa-angle-left" : "fa-angle-right"}`}
                ></i>
            </button>

            {/* Header */}
            <div className="bg-white text-teal-700 text-2xl font-semibold p-6 shadow">
                <h1 className={`text-center ${isExpanded ? "block" : "hidden"}`}>
                    📱 Mobile Store
                </h1>
                <h1 className={`text-center ${isExpanded ? "hidden" : "block"}`}>
                    📱
                </h1>
            </div>

            {isExpanded && (
                <div className="bg-teal-500 text-white p-4 flex items-center gap-3 border-b border-teal-300">
                    <i className="fas fa-user-circle text-3xl"></i>
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold truncate">{level} : {name}</span>
                        <div className="flex gap-2 mt-1 flex-wrap">
                            <button className="flex items-center gap-1 text-xs bg-white text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition"
                                onClick={handleOpenModal}>
                                <i className="fas fa-user-edit"></i>
                                แก้ไขข้อมูล
                            </button>
                            <button className="flex items-center gap-1 text-xs bg-white text-red-600 px-2 py-1 rounded hover:bg-red-200 transition"
                                onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt"></i>
                                ล็อกเอาท์
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Menu - ปรับให้มีการเลื่อนได้ */}
            <nav className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="flex flex-col gap-2 p-4 text-white text-lg font-medium">
                    <SidebarLink
                        href="/backoffice/dashboard"
                        icon="fa-chart-bar"
                        text="Dashboard"
                        expanded={isExpanded}
                    />
                    <SidebarLink
                        href="/backoffice/buy"
                        icon="fa-store"
                        text="ซื้อสินค้า"
                        expanded={isExpanded}
                    />
                    <SidebarLink
                        href="/backoffice/sell"
                        icon="fa-tags"
                        text="ขายสินค้า"
                        expanded={isExpanded}
                    />
                    <SidebarLink
                        href="/backoffice/repair"
                        icon="fa-tools"
                        text="รับซ่อม"
                        expanded={isExpanded}
                    />
                    <SidebarLink
                        href="/backoffice/company"
                        icon="fa-store-alt"
                        text="ข้อมูลร้าน"
                        expanded={isExpanded}
                    />
                    <SidebarLink
                        href="/backoffice/user"
                        icon="fa-users"
                        text="ผู้ใช้งาน"
                        expanded={isExpanded}
                    />
                </div>
            </nav>

            <Modal title="แก้ไขข้อมูลผู้ใช้งาน" isOpen={isOpenModal} onClose={handleCloseModal}>
                <div>Name</div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <div>Username</div>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                <div>Password</div>
                <input type="text" onChange={(e) => setPassword(e.target.value)} />
                <div>Confirm Password</div>
                <input type="text" onChange={(e) => setConfirmPassword(e.target.value)} />
                <div>
                    <button className="btn-save"
                        onClick={handleSave}>
                        <i className="fas fa-save" ></i>
                        บันทึก
                    </button>
                </div>
            </Modal>
        </div>
    );
}

type SidebarLinkProps = {
    href: string;
    icon: string;
    text: string;
    expanded: boolean;
};

function SidebarLink({ href, icon, text, expanded }: SidebarLinkProps) {
    return (
        <Link href={href}>
            <div
                className="hover:bg-teal-500 rounded px-3 py-2 flex items-center gap-2 transition cursor-pointer"
                title={!expanded ? text : ""} // แสดง tooltip เฉพาะตอนย่อ
            >
                <i className={`fas ${icon} text-xl`}></i>
                {expanded && <span>{text}</span>}
            </div>
        </Link>
    );
}
