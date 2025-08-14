
import Header from "@/components/Common/Navbar";
import SidebarWrapper from "@/components/Common/SidebarWrapper";

type Props = {
  children: React.ReactNode;
};

export default async function WebLayout({ children }: Props) {
 
  return (
    <div className="flex flex-row">
      
      <div className="w-full">
       
        {children}
      </div>
    </div>
  );
}
