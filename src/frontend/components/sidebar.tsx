import { BsHouse, BsLayers, BsList, BsListCheck } from "react-icons/bs";
import { FaKey, FaUser } from "react-icons/fa";

export default function SideBar() {
  return (
    <div className="sidebar">
      <div className="group-1">
        <BsHouse className="group-1-icon" />
        <BsListCheck className="group-1-icon" />
        <BsLayers className="group-1-icon" />
        <BsList className="group-1-icon" />
        <FaUser className="group-1-icon" />
      </div>
      <div className="group-2">
        <FaKey className="group-2-icon" />
      </div>
    </div>
  );
}
