import { user } from '../data';
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
                <section className="summary" aria-label="Resumo">
          <div className="summary-item">
            <p className="summary-label">Total</p>
            <p className="summary-value">3</p>
            <p className="summary-note">subscrições</p>
          </div>

          <div className="summary-item">
            <p className="summary-label">Por tipo</p>
            <p className="summary-note">
              <span className="dot dot-student"></span>1 student<br />
              <span className="dot dot-family"></span>1 family<br />
              <span className="dot dot-individual"></span>1 individual
            </p>
          </div>

          <div className="summary-item">
            <p className="summary-label">Mais antiga</p>
            <p className="summary-name">Apple Music</p>
            <p className="summary-note">há 14 anos</p>
          </div>

          <div className="summary-item">
            <p className="summary-label">Mais recente</p>
            <p className="summary-name">Netflix</p>
            <p className="summary-note">10/02/2024</p>
          </div>
        </section>
      <SubscriptionTable services={user.services} />
      </main>
  );
}

export default DashboardPage;