'use client';

interface ModalProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export default function Modal({ title, children, isOpen, onClose }: ModalProps) {
    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
    <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-xl max-h-[90vh] flex flex-col animate-fade-in overflow-hidden">

        {/* ปุ่มปิด */}
        <button
            className="absolute top-4 right-4 text-black hover:text-red-500 transition z-10"
            onClick={onClose}
            aria-label="Close modal"
        >
            <i className="fa-solid fa-xmark text-2xl"></i>
        </button>

        {/* หัวข้อ */}
        <div className="px-6 pt-6 pb-2 bg-teal-500 text-white text-center rounded-t-2xl">
            <h2 className="text-2xl font-semibold">{title}</h2>
        </div>

        {/* เนื้อหา scroll ได้ */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
            {children}
        </div>
    </div>
</div>

        )
    );
}
