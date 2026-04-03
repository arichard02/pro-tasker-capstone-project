import { useContext } from "react";
import { AuthContext } from "../context/Auth.jsx";
import { useNavigate } from "react-router-dom";
import Form from "../components/Form.jsx";

export default function Register() {
  const { register } = useContext(AuthContext);
  const  navigate  = useNavigate();

  const handleRegister = async (formData) => {
    try {
      const user = await register(formData);

      if(user) {
      // redirect to dashboard after successful registration
      navigate("/dashboard");
      }
    } catch (err) {
      alert(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <Form
      fields={[
        { name: "username", required: true },
        { name: "email", type: "email", required: true },
        { name: "password", type: "password", required: true },
      ]}
      onSubmit={handleRegister}
      buttonText="Register"
    />
  );
}
