import { useState } from "react";
import html2pdf from "html2pdf.js";

// LISTA COLLABORATORI
const users = {
  "alessia.pacifico": "123456",
  "andrea.chiodini": "123456",
  "angelo.buono": "123456",
  "angelo.sticca": "123456",
  "beatriz.gallina": "123456",
  "camilla.martina": "123456",
  "claudia.castano": "123456",
  "cecilia.lucarini": "123456",
  "chiara.longo": "123456",
  "chiara.squaratti": "123456",
  "cristina.gaeta": "123456",
  "daniele.raudo": "123456",
  "fabio.ghilardi": "123456",
  "federico.franzosi": "123456",
  "flora.padoan": "123456",
  "francesca.marchese": "123456",
  "greta.geracitano": "123456",
  "laura.pescatori": "123456",
  "leonard.neagoe": "123456",
  "loris.bicego": "123456",
  "samuele.lotta": "123456",
  "lucrezia.locatelli": "123456",
  "marco.dede": "123456",
  "massimiliano.marfoglia": "123456",
  "matteo.marinello": "123456",
  "mattia.cerullo": "123456",
  "massimiliano.dellorto": "123456",
  "paolo.stringhetti": "123456",
  "patrizia.gattullo": "123456",
  "sabina.greco": "123456",
  "sara.rossi": "123456",
  "serena.palumbo": "123456",
  "simona.caldarelli": "123456",
  "xenia.vitalone": "123456",
  "christian.dellefoglie": "123456",
  "cristina.bressani": "123456",
  "denise.facenda": "123456"
};

// LISTA MANSIONI
const mansioni = [
  "Assistente bagnanti FERIALE",
  "Assistente bagnanti FESTIVO",
  "Cassa FERIALE",
  "Cassa FESTIVO",
  "Rotazione FERIALE",
  "Rotazione FESTIVO",
  "Istruttore FERIALE",
  "Istruttore FESTIVO",
  "Aiuto allenatore FERIALE",
  "Aiuto allenatore FESTIVO",
  "Sincro/Pallan FERIALE",
  "Sincro/Pallan FESTIVO",
  "Acquagym FERIALE",
  "Acquagym FESTIVO",
  "Baby istruttore FERIALE",
  "Baby istruttore FESTIVO",
  "Baby aiuto allenatore FERIALE",
  "Baby aiuto allenatore FESTIVO",
  "Neonatale FERIALE",
  "Neonatale FESTIVO",
  "Preparto FERIALE",
  "Preparto FESTIVO",
  "Lezione individuale FERIALE",
  "Lezione individuale FESTIVO",
  "Propaganda FERIALE",
  "Propaganda FESTIVO",
  "Segreteria FERIALE",
  "Segreteria FESTIVO",
  "Coordinatore FERIALE",
  "Coordinatore FESTIVO",
  "Aquagol/Salvamento FERIALE",
  "Aquagol/Salvamento FESTIVO"
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
    setTurni([...turni, { data: "", in: "", out: "", mansione: "" }]);
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
    contenuto += `<table border='1' cellpadding='5' cellspacing='0'><tr><th>Data</th><th>Inizio</th><th>Fine</th><th>Mansione</th><th>Ore</th></tr>`;
    turni.forEach(t => {
      contenuto += `<tr><td>${t.data}</td><td>${t.in}</td><td>${t.out}</td><td>${t.mansione}</td><td>${calcolaOre(t.in, t.out)}</td></tr>`;
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
            <input type="date" value={turno.data} onChange={(e) => aggiornaTurno(index, "data", e.target.value)} style={{ marginRight: '5px' }} />
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
