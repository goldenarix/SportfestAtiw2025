import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-copyright">
          &copy; {currentYear} Sportfest App. Alle Rechte vorbehalten.
        </div>
        
        <div className="footer-links">
          <a href="#" className="footer-link">Impressum</a>
          <a href="#" className="footer-link">Datenschutz</a>
          <a href="#" className="footer-link">Hilfe</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer