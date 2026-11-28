import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="container">
      <h1>Página não encontrada</h1>
      <p className="muted">O endereço que escreveu não existe.</p>
      <Link to="/">Voltar ao painel</Link>
    </main>
  );
}

export default NotFoundPage;
