import Sidebar from "./sidebar";

export default function BckofficeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <div className="w-64 flex-shrink-0">
                <Sidebar />
            </div>
            <div className="flex-grow p-5 bg-gray-200">
                <div className="bg-white p-5 rounded-lg shadow-lg shadow-gray-500/25 h-full">
                    {children}
                </div>
            </div>
        </div>
    )
}