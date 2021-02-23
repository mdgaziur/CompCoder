import SideBar from "../components/sidebar";

export default function index() {
  return (
    <div className="main-container">
      <SideBar />
      <div className="content">
        <h1 className="cc">Dashboard</h1>
      </div>
    </div>
  );
}
