import { useState } from "react";
import { user } from "../data";
import SummaryCards from "../components/SummaryCards";
import SubscriptionTable from "../components/SubscriptionTable";
import ConfirmModal from "../components/ConfirmModal";
import ServiceFormModal from "../components/ServiceFormModal";
import Empty from "../components/Empty";

function DashboardPage() {
  const [services, setServices] = useState(user.services);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  function openCreateForm() {
    setServiceToEdit(null);
    setFormError("");
    setFormOpen(true);
  }

  function openEditForm(service) {
    setServiceToEdit(service);
    setFormError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setServiceToEdit(null);
  }

  function handleSave(data) {
    const duplicate = services.some(
      (s) =>
        s.nameService.toLowerCase() === data.nameService.toLowerCase() &&
        s.id !== serviceToEdit?.id,
    );
    if (duplicate) {
      setFormError("Já tem uma subscrição com este nome.");
      return;
    }

    setFormError("");
    setSaving(true);
    setTimeout(() => {
      if (serviceToEdit) {
        setServices(
          services.map((s) =>
            s.id === serviceToEdit.id ? { ...s, ...data } : s,
          ),
        );
      } else {
        const newService = {
          id: Date.now(),
          ...data,
          joining: new Date().toISOString(),
        };
        setServices([...services, newService]);
      }
      setSaving(false);
      closeForm();
    }, 800);
  }

  function handleConfirmDelete() {
    setDeleting(true);
    setTimeout(() => {
      setServices(services.filter((s) => s.id !== serviceToDelete.id));
      setDeleting(false);
      setServiceToDelete(null);
    }, 800);
  }
  return (
    <main className="container">
      <div className="page-header">
        <div>
          <h1>Olá, {user.nameUser}</h1>
          <p className="muted">{user.email}</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={openCreateForm}
        >
          + Nova subscrição{" "}
        </button>
      </div>

      <SummaryCards services={services} />
      {services.length === 0 ? (
        <Empty
          title="Ainda não tem subscrições"
          text="Adicione a primeira para começar a acompanhá-las aqui."
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={openCreateForm}
          >
            {" "}
            + Adicionar subscrição{" "}
          </button>
        </Empty>
      ) : (
        <SubscriptionTable
          services={services}
          onEdit={openEditForm}
          onDelete={(service) => setServiceToDelete(service)}
        />
      )}

      {formOpen && (
        <ServiceFormModal
          service={serviceToEdit}
          busy={saving}
          serverError={formError}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}

      {serviceToDelete && (
        <ConfirmModal
          title="Apagar subscrição"
          message={`Tem a certeza que quer apagar a subscrição ${serviceToDelete.nameService}?`}
          confirmLabel="Apagar"
          busy={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setServiceToDelete(null)}
        />
      )}
    </main>
  );
}

export default DashboardPage;
