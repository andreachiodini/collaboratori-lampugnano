import { useState } from "react";
import html2pdf from "html2pdf.js";

const users = {
  "alessia.pacifico": "123456",
  "andrea.chiodini": "123456",
  // ... tutti gli altri
};

const mansioni = [
  "Assistente bagnanti FERIALE",
  "Assistente bagnanti FESTIVO",
  // ... tutte le altre mansioni
];

export default function CollaboratoriLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [mese, setMese] = useState("");
  const [anno, setAnno] = useState("");
  const [turni, setTurni] = useState([]);

  const handleLogin = () => {
    if (users[username] && users[username] === password) {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Username o password errati.");
    }
  };

  const aggiungiTurno = () => {
    setTurni([...turni, { in: "", out: "", mansione: "" }]);
  };

  const aggiornaTurno = (index, campo, valore) => {
    const nuoviTurni = [...turni];
    nuoviTurni[index][campo] = valore;
    setTurni(nuoviTurni);
  };

  const calcolaOre = (inTime, outTime) => {
    if (!inTime || !outTime) return 0;
    const [inH, inM] = inTime.split(":").map(Number);
    const [outH, outM] = outTime.split(":").map(Number);
    let total = (outH * 60 + outM) - (inH * 60 + inM);
    if (total < 0) total += 24 * 60;
    return (total / 60).toFixed(2);
  };

  const esportaPDF = () => {
    let contenuto = `<h1>Centro FIN Lampugnano - Foglio Ore Mensile</h1>`;
    contenuto += `<h2>${username} - ${mese}/${anno}</h2>`;
    contenuto += `<table border='1' cellpadding='5' cellspacing='0'><tr><th>Inizio</th><th>Fine</th><th>Mansione</th><th>Ore</th></tr>`;
    turni.forEach(t => {
      contenuto += `<tr><td>${t.in}</td><td>${t.out}</td><td>${t.mansione}</td><td>${calcolaOre(t.in, t.out)}</td></tr>`;
    });
    contenuto += `</table><br><br><p>Firma collaboratore: _______________________</p>`;
    html2pdf().from(contenuto).save(`${username}_${mese}_${anno}.pdf`);
  };

  if (loggedIn) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Benvenuto {username}!</h1>

        <input type="text" placeholder="Mese (es: Aprile)" value={mese} onChange={(e) => setMese(e.target.value)} style={{ display: 'block', marginBottom: '10px' }} />
        <input type="text" placeholder="Anno (es: 2025)" value={anno} onChange={(e) => setAnno(e.target.value)} style={{ display: 'block', marginBottom: '10px' }} />

        <button onClick={aggiungiTurno} style={{ marginBottom: '10px' }}>+ Aggiungi Turno</button>

        {turni.map((turno, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <input type="time" value={turno.in} onChange={(e) => aggiornaTurno(index, "in", e.target.value)} style={{ marginRight: '5px' }} />
            <input type="time" value={turno.out} onChange={(e) => aggiornaTurno(index, "out", e.target.value)} style={{ marginRight: '5px' }} />
            <select value={turno.mansione} onChange={(e) => aggiornaTurno(index, "mansione", e.target.value)}>
              <option value="">Seleziona mansione</option>
              {mansioni.map((m, idx) => (
                <option key={idx} value={m}>{m}</option>
              ))}
            </select>
          </div>
        ))}

        <button onClick={esportaPDF}>Esporta PDF</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login Collaboratori</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ display: 'block', marginBottom: '10px' }} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ display: 'block', marginBottom: '10px' }} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
