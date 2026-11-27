import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <span className="brand">MySubs</span>

      <nav className="navbar-links" aria-label="Navegação principal">
        <NavLink to="/" end>Painel</NavLink>
        <NavLink to="/search">Pesquisar</NavLink>
        <NavLink to="/settings">Definições</NavLink>
      </nav>

      <div className="navbar-actions">
        <span className="navbar-user">Salvador Maria</span>
        <button type="button" className="bell" aria-label="Notificações">🔔</button>
      </div>
    </header>
  );
}

export default Navbar;