function App() {
  return (
    <>
      <header className="navbar">
        <span className="brand">MySubs</span>

        <nav className="navbar-links" aria-label="Navegação principal">
          <a href="#" className="active">Painel</a>
          <a href="#">Pesquisar</a>
          <a href="#">Definições</a>
        </nav>

        <div className="navbar-actions">
          <span className="navbar-user">Salvador Maria</span>
          <button type="button" className="bell" aria-label="Notificações">🔔</button>
        </div>
      </header>
            <main className="container">
        <div className="page-header">
          <div>
            <h1>Olá, Salvador Maria</h1>
            <p className="muted">salvador@example.com</p>
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
                <table className="services-table">
          <thead>
            <tr>
              <th>Serviço</th>
              <th>Tipo</th>
              <th>Desde</th>
              <th><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Apple Music</td>
              <td><span className="dot dot-student"></span>student</td>
              <td>05/08/2012</td>
              <td className="actions">
                <button type="button" className="icon-btn" aria-label="Editar Apple Music">✎</button>
                <button type="button" className="icon-btn" aria-label="Apagar Apple Music">🗑</button>
              </td>
            </tr>
            <tr>
              <td>Prime Videos</td>
              <td><span className="dot dot-family"></span>family</td>
              <td>04/09/2023</td>
              <td className="actions">
                <button type="button" className="icon-btn" aria-label="Editar Prime Videos">✎</button>
                <button type="button" className="icon-btn" aria-label="Apagar Prime Videos">🗑</button>
              </td>
            </tr>
            <tr>
              <td>Netflix</td>
              <td><span className="dot dot-individual"></span>individual</td>
              <td>10/02/2024</td>
              <td className="actions">
                <button type="button" className="icon-btn" aria-label="Editar Netflix">✎</button>
                <button type="button" className="icon-btn" aria-label="Apagar Netflix">🗑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  );
}

export default App;