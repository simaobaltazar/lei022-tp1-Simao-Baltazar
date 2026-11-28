function Empty({ title, text, children }) {
  return (
    <div className="empty-box">
      <p className="empty-title">{title}</p>
      <p className="muted">{text}</p>
      {children}
    </div>
  );
}

export default Empty;
