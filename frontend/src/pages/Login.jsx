import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth.jsx";
import Form from "../components/Form.jsx";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
     const user = await login(formData);
      // Navigate to dashboard after successful login
      navigate("/dashboard");
    } catch (err) {
      alert(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <Form
      fields={[
        { name: "email", type: "email", required: true },
        { name: "password", type: "password", required: true },
      ]}
      onSubmit={handleLogin}
      buttonText="Login"
    />
  );
}
