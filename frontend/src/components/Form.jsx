import { useState } from "react";

export default function Form({ fields, onSubmit, buttonText }) {
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validate = () => {
    const newErrors = {};

    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label || field.name} is required`;
      }
    });

    // ✅ Confirm password check
    if (formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (err) {
      setErrors({ global: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          {buttonText}
        </h2>

        {fields.map((field) => (
          <div key={field.name} style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              {field.label || field.name}
            </label>

            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: errors[field.name] ? "1px solid red" : "1px solid #ccc",
                borderRadius: "5px",
              }}
            />

            {errors[field.name] && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}

        {errors.global && (
          <p style={{ color: "red", marginBottom: "1rem" }}>{errors.global}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: loading ? "#aaa" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : buttonText}
        </button>
      </form>
    </div>
  );
}
