import { useState } from "react";
import { user } from "../data";
import { formatDate } from "../utils";
import FormField from "../components/FormField";

function validate(nameUser, email) {
  const errors = {};

  if (nameUser.trim() === "") {
    errors.nameUser = "O nome é obrigatório.";
  } else if (nameUser.length > 100) {
    errors.nameUser = "O nome tem no máximo 100 caracteres.";
  }

  if (email.trim() === "") {
    errors.email = "O email é obrigatório.";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "O email não é válido.";
  }

  return errors;
}

function SettingsPage() {
  const [nameUser, setNameUser] = useState(user.nameUser);
  const [email, setEmail] = useState(user.email);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const newErrors = validate(nameUser, email);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setMessage("Alterações guardadas.");
    }, 1000);
  }

  return (
    <main className="container">
      <h1>Definições</h1>
      <p className="muted">
        ID {user.id} · Membro desde {formatDate(user.createdAt)}
      </p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <FormField
          id="nameUser"
          label="Nome"
          value={nameUser}
          onChange={(event) => setNameUser(event.target.value)}
          error={errors.nameUser}
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "A guardar…" : "Guardar alterações"}
        </button>

        {message && (
          <p className="success-message" role="status">
            {message}
          </p>
        )}
      </form>

      <section className="danger-zone">
        <h2>Apagar conta</h2>
        <p className="muted">
          Só é possível apagar a conta depois de remover todas as subscrições.
        </p>
        <button type="button" className="btn btn-danger">
          Apagar conta
        </button>
      </section>
    </main>
  );
}

export default SettingsPage;
