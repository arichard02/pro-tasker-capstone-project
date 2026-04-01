import { useContext } from "react";
import { AuthContext } from "./context/Auth";

function App() {
  const { user, login, logout } = useContext(AuthContext);

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
    </div>
  );
}

export default App;
