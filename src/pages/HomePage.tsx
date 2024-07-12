import { Avatar } from "@/components/ui/avatar";
import thiscsi from "../assets/thiscsi.png";

const HomePage = () => {
  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-center text-3xl font-bold text-gray-900 mb-4">
            Welcome to the
            <span className="text-primary"> Management Portal</span>
          </p>
          <Avatar className="rounded-full w-48 h-48 shadow-lg">
            <img
              src={thiscsi}
              alt="CSI"
              className="rounded-full w-full h-full object-cover"
            />
          </Avatar>
        </div>
      </main>
    </>
  );
};

export default HomePage;
