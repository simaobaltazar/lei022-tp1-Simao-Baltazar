import { useState } from "react";
import FormField from "./FormField";
import { formatDate } from "../utils";

const TYPES = ["student", "family", "individual"];

function validate(nameService, type) {
  const errors = {};

  if (nameService.trim() === "") {
    errors.nameService = "O nome do serviço é obrigatório.";
  } else if (nameService.length > 100) {
    errors.nameService = "O nome tem no máximo 100 caracteres.";
  }

  if (!TYPES.includes(type)) {
    errors.type = "Escolha um tipo.";
  }

  return errors;
}

function ServiceFormModal({ service, busy, serverError, onSave, onCancel }) {
  const isEdit = service !== null;

  const [nameService, setNameService] = useState(
    isEdit ? service.nameService : "",
  );
  const [type, setType] = useState(isEdit ? service.type : "");
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = validate(nameService, type);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSave({ nameService: nameService.trim(), type });
  }

  return (
    <div className="modal-backdrop">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-form-title"
      >
        <h2 id="service-form-title">
          {isEdit ? "Editar subscrição" : "Nova subscrição"}
        </h2>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <FormField
            id="nameService"
            label="Nome do serviço"
            value={nameService}
            onChange={(event) => setNameService(event.target.value)}
            error={errors.nameService}
          />

          <div className="form-field">
            <label htmlFor="type">Tipo</label>
            <select
              id="type"
              className="input"
              value={type}
              onChange={(event) => setType(event.target.value)}
              aria-invalid={errors.type ? "true" : "false"}
              aria-describedby={errors.type ? "type-error" : undefined}
            >
              <option value="">Escolha um tipo</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.type && (
              <p id="type-error" className="field-error">
                {errors.type}
              </p>
            )}
          </div>

          {isEdit && (
            <p className="muted">
              Subscrita desde {formatDate(service.joining)}
            </p>
          )}

          {serverError && (
            <p className="field-error" role="alert">
              {serverError}
            </p>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn"
              onClick={onCancel}
              disabled={busy}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "A guardar…" : isEdit ? "Guardar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ServiceFormModal;
