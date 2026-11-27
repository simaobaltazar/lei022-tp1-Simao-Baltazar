function Navbar() {
  return (
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
  );
}

export default Navbar;