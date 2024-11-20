// src/StronaGlowna.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StronaGlowna.css';

function StronaGlowna() {
  const [marka, ustawMarka] = useState('');
  const [model, ustawModel] = useState('');
  const [samochody, ustawSamochody] = useState([]);
  const [filtrujSamochody, ustawFiltrujSamochody] = useState([]);
  const [wlasciwosci, ustawWlasciwosci] = useState([]);
  const [wybraneWlasciwosci, ustawWybraneWlasciwosci] = useState([]);
  const [obecnaStrona, ustawObecnaStrona] = useState(1);
  const samochodyNaStrone = 5;
  const [wybranySamochod, ustawWybranySamochod] = useState(null);
  const [pokazFormularz, ustawPokazFormularz] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, ustawError] = useState(null);

  useEffect(() => {
    pobierzDostepneSamochody();
    pobierzWlasciwosciSamochodow();
  }, []);

  function pobierzDostepneSamochody() {
    setLoading(true);
    axios
      .get('/car')
      .then((response) => {
        console.log('API Response:', response.data);
        if (Array.isArray(response.data)) {
          const carsData = response.data.map((car) => ({
            id: car.id,
            marka: car.brand,
            model: car.name,
            rok: car.year || 2020,
            wlasciwosci: car.properties || ['Automat', 'Benzyna'],
            opis: car.description || 'Brak opisu.',
            zdjecie: car.image || 'default_car.jpg',
            status: car.status || 'available',
          }));
          console.log('Loaded cars:', carsData);
          ustawSamochody(carsData);
          ustawFiltrujSamochody(carsData);
        } else {
          console.error('Unexpected API response format:', response.data);
          ustawError('Nieprawidłowy format danych z API.');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching cars:', error);
        ustawError('Nie udało się pobrać danych samochodów.');
        setLoading(false);
      });
  }

  function pobierzWlasciwosciSamochodow() {
    const wlasciwosciPrzykladowe = [
      'Automat',
      'Manual',
      'Benzyna',
      'Diesel',
      'Hybryda',
      'Elektryczny',
      'Sedan',
      'Kombi',
      'Hatchback',
      'SUV',
      'Premium',
    ];
    ustawWlasciwosci(wlasciwosciPrzykladowe);
  }

  function obsluzWyszukiwanie() {
    const trimmedMarka = marka.trim().toLowerCase();
    const trimmedModel = model.trim().toLowerCase();

    let wyniki = samochody.filter((samochod) => {
      const markaMatch =
        trimmedMarka === '' ||
        (samochod.marka && samochod.marka.toLowerCase().includes(trimmedMarka));
      const modelMatch =
        trimmedModel === '' ||
        (samochod.model && samochod.model.toLowerCase().includes(trimmedModel));
      return markaMatch && modelMatch;
    });

    if (wybraneWlasciwosci.length > 0) {
      wyniki = wyniki.filter((samochod) =>
        wybraneWlasciwosci.every((wlasciwosc) => samochod.wlasciwosci.includes(wlasciwosc))
      );
    }

    console.log('Filtered cars:', wyniki);
    ustawFiltrujSamochody(wyniki);
    ustawObecnaStrona(1);
  }

  function obsluzZmianeWlasciwosci(wlasciwosc) {
    if (wybraneWlasciwosci.includes(wlasciwosc)) {
      ustawWybraneWlasciwosci(wybraneWlasciwosci.filter((w) => w !== wlasciwosc));
    } else {
      ustawWybraneWlasciwosci([...wybraneWlasciwosci, wlasciwosc]);
    }
  }

  useEffect(() => {
    obsluzWyszukiwanie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wybraneWlasciwosci]);

  function stronicujSamochody() {
    const indeksOstatniegoSamochodu = obecnaStrona * samochodyNaStrone;
    const indeksPierwszegoSamochodu = indeksOstatniegoSamochodu - samochodyNaStrone;
    return filtrujSamochody.slice(indeksPierwszegoSamochodu, indeksOstatniegoSamochodu);
  }

  function renderujStronicowanie() {
    const liczbaStron = [];
    for (let i = 1; i <= Math.ceil(filtrujSamochody.length / samochodyNaStrone); i++) {
      liczbaStron.push(i);
    }
    return liczbaStron.map((numer) => (
      <button
        key={numer}
        onClick={() => ustawObecnaStrona(numer)}
        className={numer === obecnaStrona ? 'aktywny' : ''}
      >
        {numer}
      </button>
    ));
  }

  function zarezerwujSamochod(samochodId, daneKlienta) {
    axios
      .post(`/car/${samochodId}/rent`, daneKlienta)
      .then((response) => {
        alert('Samochód został wypożyczony pomyślnie!');
        pobierzDostepneSamochody();
        ustawPokazFormularz(false);
      })
      .catch((error) => {
        console.error('Error renting car:', error);
        alert('Wystąpił problem podczas wypożyczania samochodu.');
      });
  }

  return (
    <div className="kontener">
      <h1>Wypożyczalnia Samochodów</h1>

      <div className="wyszukiwarka">
        <input
          type="text"
          placeholder="Marka"
          value={marka}
          onChange={(e) => ustawMarka(e.target.value)}
        />
        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) => ustawModel(e.target.value)}
        />
        <button onClick={obsluzWyszukiwanie}>Szukaj</button>
      </div>

      <div className="filtry">
        {wlasciwosci.map((wlasciwosc) => (
          <label key={wlasciwosc}>
            <input
              type="checkbox"
              value={wlasciwosc}
              checked={wybraneWlasciwosci.includes(wlasciwosc)}
              onChange={() => obsluzZmianeWlasciwosci(wlasciwosc)}
            />
            {wlasciwosc}
          </label>
        ))}
      </div>

      {loading ? (
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="lista-samochodow">
          {stronicujSamochody().map((samochod) => (
            <div key={samochod.id} className="karta-samochodu">
              <img
                src={`/images/${samochod.zdjecie}`}
                alt={`${samochod.marka} ${samochod.model}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=Brak+zdjęcia';
                }}
              />
              <h2>
                {samochod.marka} {samochod.model} ({samochod.rok})
              </h2>
              <p>{samochod.opis}</p>
              <p>Właściwości: {samochod.wlasciwosci.join(', ')}</p>
              <button
                onClick={() => {
                  ustawWybranySamochod(samochod);
                  ustawPokazFormularz(true);
                }}
              >
                Wypożycz
              </button>
            </div>
          ))}
          {filtrujSamochody.length === 0 && <p>Brak dostępnych samochodów.</p>}
        </div>
      )}

      {!loading && !error && filtrujSamochody.length > 0 && (
        <div className="stronicowanie">{renderujStronicowanie()}</div>
      )}

      {pokazFormularz && wybranySamochod && (
        <FormularzWypozyczenia
          samochod={wybranySamochod}
          onClose={() => ustawPokazFormularz(false)}
          zarezerwujSamochod={zarezerwujSamochod}
        />
      )}
    </div>
  );
}

function FormularzWypozyczenia({ samochod, onClose, zarezerwujSamochod }) {
  const [imie, ustawImie] = useState('');
  const [nazwisko, ustawNazwisko] = useState('');
  const [email, ustawEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    zarezerwujSamochod(samochod.id, { imie, nazwisko, email });
  };

  return (
    <div className="formularz-overlay">
      <div className="formularz">
        <h2>Rezerwacja Samochodu</h2>
        <div className="formularz-car-info">
          <img
            src={`/images/${samochod.zdjecie}`}
            alt={`${samochod.marka} ${samochod.model}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x200?text=Brak+zdjęcia';
            }}
          />
          <div className="car-details">
            <h3>
              {samochod.marka} {samochod.model} ({samochod.rok})
            </h3>
            <p>{samochod.opis}</p>
            <p>Właściwości: {samochod.wlasciwosci.join(', ')}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <h3>Dane Użytkownika</h3>
          <label>
            Imię:
            <input
              type="text"
              value={imie}
              onChange={(e) => ustawImie(e.target.value)}
              required
            />
          </label>
          <label>
            Nazwisko:
            <input
              type="text"
              value={nazwisko}
              onChange={(e) => ustawNazwisko(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => ustawEmail(e.target.value)}
              required
            />
          </label>
          <div className="formularz-buttons">
            <button type="submit">Potwierdź Rezerwację</button>
            <button type="button" onClick={onClose}>
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StronaGlowna;
