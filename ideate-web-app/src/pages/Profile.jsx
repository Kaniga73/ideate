import Navbar from "../components/Navbar";

function Profile() {

  
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    { name: "Guest", role: "Employee" };

  return (
    <div>

      {/* Navbar */}
      <Navbar user={user} />

      {/* Profile Content */}
      <div>
        <h1>Hello</h1>
        <p>Welcome to your profile page.</p>
      </div>

    </div>
  );
}

export default Profile;