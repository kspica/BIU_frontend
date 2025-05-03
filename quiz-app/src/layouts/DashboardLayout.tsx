import { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <Topbar />
                <div className="page-content">{children}</div>
            </div>
        </div>
    );
};
