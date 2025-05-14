"use client";

import { useState, useEffect, } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { config } from "@/app/config";
import Modal from "@/app/backoffice/modal";
import dayjs from "dayjs";

export default function Page() {
    const [users, setUsers] = useState([]);
    const [isOpenModal, setisOpenModal] = useState(false);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordComfirm] = useState("");
    const [level, setLevel] = useState("user");
    const [levelList, setLevelList] = useState(["admin", "user"]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${config.apiUrl}/user/list`);
            setUsers(res.data);
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถดึงข้อมูลงานบริการได้",
                timer: 1500,
            });
        }
    };

    const handleOpenModal = () => {
        setisOpenModal(true);
    };

    const handleCloseModal = () => {
        setisOpenModal(false);
    };

    const handleSave = async () => {
        try {
            if (password !== passwordConfirm) {
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด",
                    text: "รหัสผ่านไม่ตรงกัน",
                    timer: 1500,
                });
                return;
            }
            const payload = {
                name: name,
                username: username,
                password: password,
                level: level,
            }
            if (id === '') {
                await axios.post(`${config.apiUrl}/user/create`, payload);
            } else {
                await axios.put(`${config.apiUrl}/user/update/${id}`, payload);
                setId("");
            }
            Swal.fire({
                icon: "success",
                title: "บันทึกข้อมูลสำเร็จ",
                text: "ข้อมูลผู้ใช้งานได้ถูกบันทึกเรียบร้อยแล้ว",
                timer: 1500,
            });
            fetchData();
            handleCloseModal();
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถเพิ่มผู้ใช้งานได้",
                timer: 1500,
            });
        }
    };

    const handleEdit = (id: string) => {
        const user = users.find((user: any) => user.id === id) as any;
        setId(user.id);
        setName(user.name);
        setUsername(user.username);
        setPassword(user.password);
        setLevel(user.level);
        setisOpenModal(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const button = await Swal.fire({
                title: "คุณแน่ใจหรือไม่?",
                text: "คุณต้องการลบผู้ใช้งานนี้",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "ใช่",
                cancelButtonText: "ยกเลิก",
            })
            if (button.isConfirmed) {
                await axios.delete(`${config.apiUrl}/user/remove/${id}`);
                Swal.fire({
                    icon: "success",
                    title: "ลบข้อมูลสำเร็จ",
                    text: "ข้อมูลผู้ใช้งานได้ถูกลบเรียบร้อยแล้ว",
                    timer: 1500,
                });
                fetchData();
            }
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถลบข้อมูลรายการซื้อได้",
                timer: 1500,
            });
        }
    }


    return (
        <div>
            <h1 className="container-header">ผู้ใช้งาน</h1>
            <div>
                <button className="btn-plus" onClick={handleOpenModal}>
                    <i className="fas fa-plus"></i>เพิ่มผู้ใช้งาน
                </button>

                <div className="overflow-y-auto max-h-[70vh] mt-4 rounded-md scrollbar-hide">
                    <table>
                        <thead>
                            <tr>
                                <th>ชื่อผู้ใช้งาน</th>
                                <th>username</th>
                                <th>Level</th>
                                <th className="w-[100px] text-center">แก้ไข / ลบ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user: any) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.username}</td>
                                    <td>{user.level}</td>
                                    <td className="text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEdit(user.id)}
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal
                title="เพิ่มผู้ใช้งาน"
                isOpen={isOpenModal}
                onClose={handleCloseModal}
            >
                <div>ชื่อ</div>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div>Username</div>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <div>Password</div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div>ยืนยัน Password</div>
                <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordComfirm(e.target.value)}
                />
                <div>ระดับผู้ใช้งาน</div>
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                >
                    {" "}
                    {levelList.map((item: any) => (
                        <option value={item} key={item}>{item}</option>
                    ))}
                </select>
                <div>
                    <button className="btn-save"
                        onClick={handleSave}>
                        <i className="fas fa-save"></i>
                        บันทึก
                    </button>
                </div>
            </Modal>
        </div>
    );

}