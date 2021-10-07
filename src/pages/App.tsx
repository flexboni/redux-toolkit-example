import { useState } from "react";
import "./App.css";
import { Pokemon } from "./Pokemon";
import { useGetPokemonByNameQuery } from "../services/pokemon";

const pokemon = ["bulbasaur", "pikachu", "ditto", "bulbasaur"];

function App() {
  const [pollingInterval, setPollingInterval] = useState(0);

  return (
    <div className="App">
      <select
        onChange={(change) => setPollingInterval(Number(change.target.value))}
      >
        <option value={0}>Off</option>
        <option value={1000}>1s</option>
        <option value={5000}>5s</option>
      </select>
      <div>
        {pokemon.map((poke, index) => (
          <Pokemon key={index} name={poke} pollingInterval={pollingInterval} />
        ))}
      </div>
    </div>
  );
}

export default App;
