import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth.jsx";
import Form from "../components/Form.jsx";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Form
      fields={[
        { name: "username", label: "Username", required: true },
        { name: "email", type: "email", label: "Email", required: true },
        {
          name: "password",
          type: "password",
          label: "Password",
          required: true,
        },
        {
          name: "confirmPassword",
          type: "password",
          label: "Confirm Password",
          required: true,
        }, // ✅ new
      ]}
      onSubmit={handleRegister}
      buttonText="Create Account"
    />
  );
}
