import { formatDate } from '../utils';

const CURRENT_YEAR = new Date().getFullYear();

function SummaryCards({ services }) {
  if (services.length === 0) {
    return null;
  }

  const total = services.length;
  const students = services.filter((s) => s.type === 'student').length;
  const families = services.filter((s) => s.type === 'family').length;
  const individuals = services.filter((s) => s.type === 'individual').length;

  const sorted = [...services].sort((a, b) => new Date(a.joining) - new Date(b.joining));
  const oldest = sorted[0];
  const newest = sorted[sorted.length - 1];
  const years = CURRENT_YEAR - new Date(oldest.joining).getFullYear();

  return (
    <section className="summary" aria-label="Resumo">
      <div className="summary-item">
        <p className="summary-label">Total</p>
        <p className="summary-value">{total}</p>
        <p className="summary-note">subscrições</p>
      </div>

      <div className="summary-item">
        <p className="summary-label">Por tipo</p>
        <p className="summary-note">
          <span className="dot dot-student"></span>{students} student<br />
          <span className="dot dot-family"></span>{families} family<br />
          <span className="dot dot-individual"></span>{individuals} individual
        </p>
      </div>

      <div className="summary-item">
        <p className="summary-label">Mais antiga</p>
        <p className="summary-name">{oldest.nameService}</p>
        <p className="summary-note">há {years} anos</p>
      </div>

      <div className="summary-item">
        <p className="summary-label">Mais recente</p>
        <p className="summary-name">{newest.nameService}</p>
        <p className="summary-note">{formatDate(newest.joining)}</p>
      </div>
    </section>
  );
}

export default SummaryCards;