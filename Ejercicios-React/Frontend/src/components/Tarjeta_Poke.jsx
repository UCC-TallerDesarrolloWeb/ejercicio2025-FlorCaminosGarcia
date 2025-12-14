import { useState } from "react";

const PokeCard = ({ pokemon }) => {
    const [isShiny, setIsShiny] = useState(false);

    return (
        <div className="poke-card">
            <img
                src={
                    isShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default
                }
                alt={pokemon.name}
                className="poke-image"
            />
            <h2>{pokemon.name}</h2>
            <p>ID: {pokemon.id}</p>
            <p>Peso: {pokemon.weight}</p>
            <button
                onClick={() => setIsShiny(!isShiny)}
                className="shiny-button"
            >
                {isShiny ? "Normal" : "Shiny"}
            </button>
        </div>
    );
};

export default PokeCard;