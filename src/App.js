import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';



function App() {
  const [count, setCount] = useState(() => {
  const storedCount = localStorage.getItem('count');
    return storedCount !== null ? parseInt(storedCount) : 0;
  });

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]);

  const handleClick = () => {
    setCount(count + 1);
     
  axios.get('https://ipapi.co/json/')
  .then(response => {
    const location = {
      city: response.data.city,
      region: response.data.region,
      country: response.data.country_name,
      latitude: response.data.latitude,
      longitude: response.data.longitude
    };
    
    setLocations([...locations, location]);

    axios.post('/clicks', {
      count: count + 1,
      location: location
    }).then(response => {
      console.log(response.data);
    }).catch(error => {
      console.log(error);
    });
  })
  .catch((error) => {
    console.log(error);
    alert('Unable to get location information. Please try again later.');
  });
};
  

  return (
    <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <div className="count-container">
        <h1>Click Count: {count}</h1>
        <button onClick={handleClick} className="btn btn-primary">Click me!</button>
      </div>
      <div className='clicks-dist'>
          <h2>Distribution of Clicks by Geography</h2>
          <table>
            <thead>
              <tr>
                <th>City</th>
                <th>Region</th>
                <th>Country</th>
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location, index) => (
                <tr key={index}>
                  <td>{location.city}</td>
                  <td>{location.region}</td>
                  <td>{location.country}</td>
                  <td>{location.latitude}</td>
                  <td>{location.longitude}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>
    </div>
  );
}

export default App;
