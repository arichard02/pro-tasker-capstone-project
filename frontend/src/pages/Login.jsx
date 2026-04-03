import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import Form from "../components/Form";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (formData) => {
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Form
        fields={[
          { name: "email", type: "email", required: true },
          { name: "password", type: "password", required: true },
        ]}
        onSubmit={handleLogin}
        buttonText="Login"
      />
    </div>
  );
}