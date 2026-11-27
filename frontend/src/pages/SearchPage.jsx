import { useState } from 'react';
import { allServices } from '../data';
import SubscriptionTable from '../components/SubscriptionTable';

function SearchPage() {
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setSearch(text.trim());
  }

  const results = search
    ? allServices.filter((s) => s.nameService.toLowerCase() === search.toLowerCase())
    : allServices;

  return (
    <main className="container">
      <h1>Pesquisar subscrições</h1>

      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="search">Nome do serviço</label>
        <div className="search-row">
          <input
            id="search"
            type="search"
            className="input"
            placeholder="Netflix"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <button type="submit" className="btn btn-primary">Pesquisar</button>
        </div>
      </form>

      {results.length === 0 ? (
        <p className="muted">Nenhuma subscrição chamada "{search}".</p>
      ) : (
        <SubscriptionTable services={results} />
      )}
    </main>
  );
}

export default SearchPage;