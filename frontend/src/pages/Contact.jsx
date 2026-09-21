import { useState } from "react";

function Contact() {

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      message: ""
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
      "Thank you for contacting Pet House!"
    );

    setForm({
      name: "",
      email: "",
      message: ""
    });

  };


  return (

    <div className="form-page">

      <div className="form-card">

        <h1>
          Contact Us 📩
        </h1>

        <p>
          We'd love to hear from you.
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
              Message
            </label>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="5"
              required
            />

          </div>


          <button
            className="form-submit"
            type="submit"
          >
            Send Message
          </button>

        </form>

      </div>

    </div>
  );
}

export default Contact;