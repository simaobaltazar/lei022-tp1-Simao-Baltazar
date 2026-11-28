import { useState } from "react";
import { user } from "../data";
import { formatDate } from "../utils";
import FormField from "../components/FormField";
import ConfirmModal from "../components/ConfirmModal";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleted, setDeleted] = useState(false);

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

  function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError("");

    setTimeout(() => {
      setDeleting(false);
      setConfirmOpen(false);
      if (user.services.length > 0) {
        setDeleteError(
          "Não é possível apagar a conta enquanto tiver subscrições. Apague-as primeiro no painel.",
        );
      } else {
        setDeleted(true);
      }
    }, 800);
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

        {deleted ? (
          <p className="success-message" role="status">
            Conta apagada.
          </p>
        ) : (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setConfirmOpen(true)}
          >
            Apagar conta
          </button>
        )}

        {deleteError && (
          <p className="field-error" role="alert">
            {deleteError}
          </p>
        )}
      </section>

      {confirmOpen && (
        <ConfirmModal
          title="Apagar conta"
          message={`Tem a certeza que quer apagar a conta de ${user.nameUser}? Esta ação não pode ser desfeita.`}
          confirmLabel="Apagar conta"
          busy={deleting}
          onConfirm={handleDeleteAccount}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </main>
  );
}

export default SettingsPage;
