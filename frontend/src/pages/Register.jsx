import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import Form from "../components/Form";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = async (formData) => {
    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Form
        fields={[
          { name: "username", required: true },
          { name: "email", type: "email", required: true },
          { name: "password", type: "password", required: true },
        ]}
        onSubmit={handleRegister}
        buttonText="Register"
      />
    </div>
  );
}