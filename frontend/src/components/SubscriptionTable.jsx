import { formatDate } from '../utils';

function SubscriptionTable({ services, onEdit, onDelete }) {
  const showActions = onEdit || onDelete;
  return (
    <table className="services-table">
      <thead>
        <tr>
          <th>Serviço</th>
          <th>Tipo</th>
          <th>Desde</th>
          {showActions && <th><span className="sr-only">Ações</span></th>}

        </tr>
      </thead>
      <tbody>
        {services.map((service) => (
          <tr key={service.id}>
            <td>{service.nameService}</td>
            <td><span className={`dot dot-${service.type}`}></span>{service.type}</td>
            <td>{formatDate(service.joining)}</td>
            {showActions && (
            <td className="actions">
            <button type="button" className="icon-btn" aria-label={`Editar ${service.nameService}`} onClick={() => onEdit(service)}>✎</button>
            <button type="button" className="icon-btn" aria-label={`Apagar ${service.nameService}`} onClick={() => onDelete(service)}>🗑</button>
            </td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SubscriptionTable;