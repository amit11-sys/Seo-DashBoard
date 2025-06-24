"use client";

import { Nav } from "@/components/ui/nav";
import {
  FaBook,              // BookText
  FaUserGraduate,      // BookUserIcon (closest equivalent - user with book feel)
  FaCreditCard,        // CreditCard
  FaDatabase,          // Database
  FaDownload,          // Download
  FaHome,              // House
  FaEnvelope,          // Mail
  FaMinus,             // Minus
  FaBox,               // Package
  FaFileInvoiceDollar, // Receipt
  FaCog,               // Settings
  FaTruck,             // Truck
  FaUpload,            // Upload
  FaUsers,             // Users
} from "react-icons/fa";

import { usePathname } from "next/navigation";

type SidebarProps = {
  isCollapsed: boolean;
};

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      <Nav
        isCollapsed={isCollapsed}
       links={[
  {
    title: "Dashboard",
    href: "/inventory",
    icon: FaHome,
    variant: pathname === "/inventory" ? "default" : "ghost",
  },
  {
    title: "User Campaigns",
    href: "#",
    label: "",
    icon: FaUsers,
    variant: "ghost",
    dropdownItems: [
      {
        title: "Users",
        href: "/inventory/users",
        label: "",
        icon: FaMinus,
        variant: pathname === "/inventory/users" ? "default" : "ghost",
      },
      {
        title: "Roles",
        href: "/inventory/roles",
        label: "",
        icon: FaMinus,
        variant: pathname === "/inventory/roles" ? "default" : "ghost",
      },
    ],
  },
  {
    title: "Contacts",
    href: "#",
    label: "",
    icon: FaUserGraduate,
    variant: "ghost",
    dropdownItems: [
      {
        title: "Suppliers",
        href: "/inventory/contacts?type=suppliers",
        label: "",
        icon: FaMinus,
        variant: "ghost",
      },
      {
        title: "Customers",
        href: "/inventory/contacts?type=customers",
        label: "",
        icon: FaMinus,
        variant: "ghost",
      },
    ],
  },
]}

      />
      {/* <Separator />
      {!isCollapsed && (
        <h4 className="mt-3 px-4 text-base font-semibold tracking-tight">
          Discover
        </h4>
      )} */}
    </>
  );
};

export default Sidebar;
