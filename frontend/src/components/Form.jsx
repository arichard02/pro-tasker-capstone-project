import { useState } from "react";

export default function Form({ fields, onSubmit, buttonText }) {
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({}); // ✅ fixed name
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // ✅ FIX: moved inside function
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Validate fields
  const validate = () => {
    const newErrors = {};

    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label || field.name} is required`;
      }
    });

    return newErrors;
  };

  // Handle submit
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
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      {fields.map((field) => (
        <div key={field.name} style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            {field.label || field.name}
          </label>

          <input
            type={field.type || "text"}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              border: errors[field.name] ? "1px solid red" : "1px solid #ccc",
              borderRadius: "4px",
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
          background: loading ? "#aaa" : "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Processing..." : buttonText}
      </button>
    </form>
  );
}
