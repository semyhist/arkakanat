import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [raceData, setRaceData] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const translateRaceName = (name) => {
    const translations = {
      'Bahrain Grand Prix': 'Bahreyn Grand Prix',
      'Saudi Arabian Grand Prix': 'Suudi Arabistan Grand Prix',
      'Australian Grand Prix': 'Avustralya Grand Prix',
      'Japanese Grand Prix': 'Japonya Grand Prix',
      'Chinese Grand Prix': 'Çin Grand Prix',
      'Miami Grand Prix': 'Miami Grand Prix',
      'Emilia Romagna Grand Prix': 'Emilia Romagna Grand Prix',
      'Monaco Grand Prix': 'Monako Grand Prix',
      'Spanish Grand Prix': 'İspanya Grand Prix',
      'Canadian Grand Prix': 'Kanada Grand Prix',
      'Austrian Grand Prix': 'Avusturya Grand Prix',
      'British Grand Prix': 'Britanya Grand Prix',
      'Hungarian Grand Prix': 'Macaristan Grand Prix',
      'Belgian Grand Prix': 'Belçika Grand Prix',
      'Dutch Grand Prix': 'Hollanda Grand Prix',
      'Italian Grand Prix': 'İtalya Grand Prix',
      'Azerbaijan Grand Prix': 'Azerbaycan Grand Prix',
      'Singapore Grand Prix': 'Singapur Grand Prix',
      'United States Grand Prix': 'Amerika Grand Prix',
      'Mexico City Grand Prix': 'Meksika Grand Prix',
      'São Paulo Grand Prix': 'São Paulo Grand Prix',
      'Las Vegas Grand Prix': 'Las Vegas Grand Prix',
      'Qatar Grand Prix': 'Katar Grand Prix',
      'Abu Dhabi Grand Prix': 'Abu Dabi Grand Prix'
    };
    return translations[name] || name;
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetch('https://api.jolpi.ca/ergast/f1/current/next.json')
      .then(res => res.json())
      .then(data => setRaceData(data.MRData.RaceTable.Races[0]));
  }, []);

  useEffect(() => {
    if (!raceData) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const raceDate = new Date(`${raceData.date}T${raceData.time}`);
      const diff = raceDate - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [raceData]);

  const getSessions = () => {
    if (!raceData) return [];
    const sessions = [];
    
    if (raceData.FirstPractice) sessions.push({ name: 'Antrenman 1', ...raceData.FirstPractice });
    if (raceData.SecondPractice) sessions.push({ name: 'Antrenman 2', ...raceData.SecondPractice });
    if (raceData.ThirdPractice) sessions.push({ name: 'Antrenman 3', ...raceData.ThirdPractice });
    if (raceData.Sprint) sessions.push({ name: 'Sprint', ...raceData.Sprint });
    if (raceData.Qualifying) sessions.push({ name: 'Sıralama', ...raceData.Qualifying });
    sessions.push({ name: 'Yarış', date: raceData.date, time: raceData.time });
    
    return sessions;
  };

  const formatTime = (date, time) => {
    const dt = new Date(`${date}T${time}`);
    return dt.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date, time) => {
    const dt = new Date(`${date}T${time}`);
    return dt.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', day: 'numeric', month: 'long', weekday: 'short' });
  };

  return (
    <div className="app">
      <div className="wave-bg"></div>
      
      <header className="header">
        <img src="/Arka_Kanat_Logo_Paketi/logo.png" alt="Arka Kanat" />
        <nav className="nav-menu">
          <button onClick={() => scrollToSection('hero')}>Yarış</button>
          <button onClick={() => scrollToSection('timeline')}>Program</button>
          <button onClick={() => scrollToSection('info')}>Hakkımızda</button>
        </nav>
      </header>

      <main className="main">
        <section id="hero" className="hero">
          {raceData && (
            <>
              <p className="hero-subtitle">Sonraki Yarış</p>
              <h1 className="hero-title">{translateRaceName(raceData.raceName)}</h1>
              <p className="hero-location">{raceData.Circuit.Location.locality}, {raceData.Circuit.Location.country}</p>
              
              <div className="countdown">
                <div className="countdown-box">
                  <span className="countdown-value">{String(countdown.days).padStart(2, '0')}</span>
                  <span className="countdown-unit">Gün</span>
                </div>
                <div className="countdown-box">
                  <span className="countdown-value">{String(countdown.hours).padStart(2, '0')}</span>
                  <span className="countdown-unit">Saat</span>
                </div>
                <div className="countdown-box">
                  <span className="countdown-value">{String(countdown.minutes).padStart(2, '0')}</span>
                  <span className="countdown-unit">Dakika</span>
                </div>
              </div>
            </>
          )}
        </section>

        <section id="timeline" className="timeline-section">
          <h2 className="section-title">Program</h2>
          <div className="timeline">
            {getSessions().map((session, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>{session.name}</h3>
                  <p className="timeline-date">{formatDate(session.date, session.time)}</p>
                  <p className="timeline-time">{formatTime(session.date, session.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="info" className="info-section">
          <div className="info-box">
            <h2>İletişim</h2>
            <p>İş birlikleri ve sorularınız için</p>
            <a href="mailto:arkkanat@gmail.com">arkkanat@gmail.com</a>
          </div>
        </section>
      </main>

      <div className="social-fab">
        <a href="https://instagram.com/arkakanat" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
        <a href="https://x.com/arkakanat" target="_blank" rel="noopener noreferrer" aria-label="X">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href="https://tiktok.com/@arka.kanat" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
        </a>
        <a href="https://youtube.com/@arkakanat" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </a>
        <a href="https://discord.gg/arkakanat" target="_blank" rel="noopener noreferrer" aria-label="Discord">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
        </a>
      </div>
    </div>
  );
}

export default App;
