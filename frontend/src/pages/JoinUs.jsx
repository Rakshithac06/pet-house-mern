import { useState } from "react";

function JoinUs() {

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      phone: "",
      service: "",
      experience: ""
    });


  const handleChange = e => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  const submit = e => {

    e.preventDefault();

    alert(
      "Thank you! Your application has been submitted."
    );

    setForm({
      name: "",
      email: "",
      phone: "",
      service: "",
      experience: ""
    });

  };


  return (

    <div className="form-page">

      <div className="form-card">

        <h1>
          Join Our Team 🐾
        </h1>

        <p>
          Become a groomer, sitter or dog walker
        </p>


        <form onSubmit={submit}>

          <div className="form-group">

            <label>
              Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>
              Phone
            </label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>
              Service
            </label>

            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              required
            >

              <option value="">
                Select service
              </option>

              <option value="groomer">
                Dog Groomer
              </option>

              <option value="walker">
                Dog Walker
              </option>

              <option value="sitter">
                Dog Sitter
              </option>

            </select>

          </div>


          <div className="form-group">

            <label>
              Experience
            </label>

            <textarea
              name="experience"
              value={form.experience}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about your experience"
            />

          </div>


          <button
            type="submit"
            className="form-submit"
          >
            Submit Application
          </button>

        </form>

      </div>

    </div>
  );
}

export default JoinUs;