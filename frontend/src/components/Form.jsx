import { useState } from "react";

export default function Form({ fields, onSubmit, buttonText }) {
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name}>
          <input
            type={field.type || "text"}
            name={field.name}
            placeholder={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            required={field.required}
          />
        </div>
      ))}

      <button type="submit">{buttonText}</button>
    </form>
  );
}
