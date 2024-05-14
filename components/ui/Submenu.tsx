import { useMenuStore } from "@/store/menuStore";

const SubMenu = ({ title, children }: { title: string, children : any }) => {
  const activeTab = useMenuStore((state) => state.activeTab);
  return (
    <>
      {activeTab === title ? (
        <div className={ `no-scrollbar absolute top-0 right-12 p-2 bg-gray-50 rounded w-[15vw] overflow-y-scroll h-[85vh] flex flex-col gap-2` }>
          {children}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export  default SubMenu;
