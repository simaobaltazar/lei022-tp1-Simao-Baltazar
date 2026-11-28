import { useState } from 'react';
import { user } from '../data';
import SummaryCards from '../components/SummaryCards';
import SubscriptionTable from '../components/SubscriptionTable';
import ConfirmModal from '../components/ConfirmModal';

function DashboardPage() {
   const [services, setServices] = useState(user.services);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
          <button type="button" className="btn btn-primary">+ Nova subscrição</button>
        </div>

      <SummaryCards services={services} />
      <SubscriptionTable
        services={services}
        onEdit={(service) => console.log('editar', service)}
        onDelete={(service) => setServiceToDelete(service)}
      />

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