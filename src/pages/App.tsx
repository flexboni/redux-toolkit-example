import { useState } from "react";

import "./App.css";

import { useGetPokemonByNameQuery } from "../services/pokemon";

import { Pokemon } from "./Pokemon";

function App() {
  const [pollingInterval, setPollingInterval] = useState(0);
  const { data, error, isLoading } = useGetPokemonByNameQuery("bulbasaur");

  return (
    <div className="App">
      {error && <>Oh no, there was an error</>}
      {!error && isLoading && <>Loading...</>}
      {!error && !isLoading && data && (
        <>
          <h3>{data.species.name}</h3>
          <img src={data.sprites.front_shiny} alt={data.species.name} />
        </>
      )}
      {/* <select
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
      </div> */}
    </div>
  );
}

export default App;
