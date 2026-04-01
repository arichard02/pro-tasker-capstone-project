import { useContext } from "react";
import { AuthContext } from "./context/Auth";
import { request } from "./utils/api";

function App() {
  const { user, login, logout } = useContext(AuthContext);

      //  test API function
  const testAPI = async () => {
    try {
      const data = await request("/test");
      console.log("API response:", data);
    } catch (err) {
      console.log("API error:", err.message);
    }
  };


  return (
    <div>
      <h1>Auth Test</h1>

      {user ? (
        <>
          <p>Logged in as: {user.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button
          onClick={() => login({ email: "test@test.com", token: "fake123" })}
        >
          Fake Login
        </button>
      )}

        <hr />

       {/* API TEST */} 
      <button onClick={testAPI}>Test API</button>
    </div>
  );
}

export default App;
