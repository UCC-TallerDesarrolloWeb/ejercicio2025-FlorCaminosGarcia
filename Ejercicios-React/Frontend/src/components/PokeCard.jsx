import { useState } from "react";
import PropTypes from "prop-types";
import "../style/PokeCard.css";

const PokeCard = ({ pokemon }) => {
    const [isShiny, setIsShiny] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Función para manejar sprites seguros (evita errores si falta algún sprite)
    const getSprite = () => {
        if (!pokemon?.sprites) return "/placeholder-pokemon.png";

        if (isShiny && pokemon.sprites.front_shiny) {
            return pokemon.sprites.front_shiny;
        }

        // Si no hay sprite shiny o estamos en modo normal
        return pokemon.sprites.front_default || "/default-pokemon.png";
    };

    // Formatear el nombre del Pokémon (primera letra mayúscula)
    const formatName = (name) => {
        return name ? name.charAt(0).toUpperCase() + name.slice(1) : "Unknown";
    };

    // Formatear peso (de hectogramos a kilogramos)
    const formatWeight = (weight) => {
        return (weight / 10).toFixed(1); // Convierte a kg con 1 decimal
    };

    // Formatear altura (de decímetros a metros)
    const formatHeight = (height) => {
        return (height / 10).toFixed(1); // Convierte a metros con 1 decimal
    };

    // Manejar clic en el botón shiny
    const handleShinyToggle = () => {
        if (pokemon.sprites?.front_shiny) {
            setIsShiny(!isShiny);
        }
    };

    return (
        <div className="poke-card" data-testid="poke-card">
            {/* Encabezado con nombre y ID */}
            <div className="poke-card-header">
                <h2 className="poke-name">{formatName(pokemon.name)}</h2>
                <span className="poke-id">#{pokemon.id.toString().padStart(3, '0')}</span>
            </div>

            {/* Contenedor de imagen */}
            <div className="poke-image-container">
                {imageError ? (
                    <div className="poke-image-error">
                        <span>⚠️ Imagen no disponible</span>
                    </div>
                ) : (
                    <img
                        src={getSprite()}
                        alt={`${pokemon.name} ${isShiny ? 'shiny' : 'normal'}`}
                        className="poke-image"
                        onError={() => setImageError(true)}
                        loading="lazy"
                    />
                )}
            </div>

            {/* Tipos del Pokémon */}
            <div className="poke-types">
                {pokemon.types?.map((typeInfo, index) => (
                    <span
                        key={`${pokemon.id}-type-${index}`}
                        className={`type-badge type-${typeInfo.type.name}`}
                        title={typeInfo.type.name}
                    >
                        {typeInfo.type.name}
                    </span>
                ))}
            </div>

            {/* Estadísticas básicas */}
            <div className="poke-stats">
                <div className="stat-item">
                    <span className="stat-label">Peso:</span>
                    <span className="stat-value">{formatWeight(pokemon.weight)} kg</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Altura:</span>
                    <span className="stat-value">{formatHeight(pokemon.height)} m</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">HP:</span>
                    <span className="stat-value">{pokemon.stats?.[0]?.base_stat || "N/A"}</span>
                </div>
            </div>

            {/* Botón Shiny */}
            <button
                type="button"
                onClick={handleShinyToggle}
                className={`shiny-toggle-btn ${isShiny ? 'active' : ''} ${!pokemon.sprites?.front_shiny ? 'disabled' : ''}`}
                disabled={!pokemon.sprites?.front_shiny}
                aria-label={`Cambiar a versión ${isShiny ? 'normal' : 'shiny'}`}
            >
                <span className="btn-icon">{isShiny ? "🌟" : "✨"}</span>
                <span className="btn-text">
                    {!pokemon.sprites?.front_shiny
                        ? "No shiny"
                        : isShiny ? "Versión Normal" : "Versión Shiny"
                    }
                </span>
            </button>
        </div>
    );
};

// PropTypes para validación de props
PokeCard.propTypes = {
    pokemon: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        sprites: PropTypes.shape({
            front_default: PropTypes.string,
            front_shiny: PropTypes.string,
        }),
        types: PropTypes.arrayOf(
            PropTypes.shape({
                type: PropTypes.shape({
                    name: PropTypes.string.isRequired,
                }).isRequired,
            })
        ),
        weight: PropTypes.number,
        height: PropTypes.number,
        stats: PropTypes.array,
    }).isRequired,
};

export default PokeCard;