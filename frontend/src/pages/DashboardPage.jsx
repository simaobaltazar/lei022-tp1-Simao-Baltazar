import { user } from '../data';
import SummaryCards from '../components/SummaryCards';
import SubscriptionTable from '../components/SubscriptionTable';

function DashboardPage() {
  return (
     <main className="container">
        <div className="page-header">
          <div>
            <h1>Olá, {user.nameUser}</h1>
            <p className="muted">{user.email}</p>
          </div>
          <button type="button" className="btn btn-primary">+ Nova subscrição</button>
        </div>
      <SummaryCards services={user.services} />
      <SubscriptionTable services={user.services} />
      </main>
  );
}

export default DashboardPage;