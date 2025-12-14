import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import PokeCard from "@components/PokeCard";
import SearchBar from "@components/SearchBar";
import TypeFilter from "@components/TypeFilter";
import LoadingSpinner from "@components/LoadingSpinner";
import ErrorMessage from "@components/ErrorMessage";
import "@styles/Home.css";

const Home = () => {
    // Estados
    const [pokemonData, setPokemonData] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPokemon, setTotalPokemon] = useState(0);

    // Constantes
    const POKEMON_PER_PAGE = 20;
    const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
    const TOTAL_POKEMON_API = 1302; // Total de Pokémon en la API

    // Función para cargar Pokémon con paginación
    const fetchPokemons = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const offset = (currentPage - 1) * POKEMON_PER_PAGE;

            // Primero obtenemos la lista de Pokémon paginada
            const listResponse = await fetch(
                `${BASE_URL}?limit=${POKEMON_PER_PAGE}&offset=${offset}`
            );

            if (!listResponse.ok) throw new Error("Error al cargar la lista de Pokémon");

            const listData = await listResponse.json();
            setTotalPokemon(listData.count || TOTAL_POKEMON_API);

            // Luego obtenemos los datos completos de cada Pokémon
            const detailedPromises = listData.results.map(async (pokemon) => {
                const response = await fetch(pokemon.url);
                if (!response.ok) throw new Error(`Error al cargar ${pokemon.name}`);
                return await response.json();
            });

            const detailedData = await Promise.all(detailedPromises);
            setPokemonData(detailedData);
            setFilteredPokemon(detailedData);

        } catch (err) {
            setError(err.message);
            console.error("Error fetching Pokémon:", err);
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    // Efecto para cargar Pokémon cuando cambia la página
    useEffect(() => {
        fetchPokemons();
    }, [fetchPokemons]);

    // Efecto para filtrar Pokémon cuando cambia searchTerm o selectedTypes
    useEffect(() => {
        let filtered = [...pokemonData];

        // Filtro por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pokemon.id.toString().includes(searchTerm)
            );
        }

        // Filtro por tipos
        if (selectedTypes.length > 0) {
            filtered = filtered.filter(pokemon =>
                selectedTypes.every(type =>
                    pokemon.types.some(pokeType =>
                        pokeType.type.name === type
                    )
                )
            );
        }

        setFilteredPokemon(filtered);
    }, [searchTerm, selectedTypes, pokemonData]);

    // Handlers
    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1); // Resetear a primera página al buscar
    };

    const handleTypeFilter = (types) => {
        setSelectedTypes(types);
        setCurrentPage(1); // Resetear a primera página al filtrar
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedTypes([]);
        setCurrentPage(1);
    };

    // Calcular número total de páginas
    const totalPages = Math.ceil(totalPokemon / POKEMON_PER_PAGE);

    // Renderizar contenido según estado
    if (loading && pokemonData.length === 0) {
        return (
            <div className="home-loading">
                <LoadingSpinner />
                <p className="loading-text">Cargando Pokémon...</p>
            </div>
        );
    }

    if (error) {
        return (
            <ErrorMessage
                message={error}
                onRetry={fetchPokemons}
            />
        );
    }

    return (
        <div className="home-container">
            {/* Header */}
            <header className="home-header">
                <div className="header-content">
                    <h1 className="home-title">
                        <span className="title-text">Pokédex</span>
                        <span className="title-badge">{totalPokemon}</span>
                    </h1>
                    <p className="home-subtitle">
                        Explora el maravilloso mundo de los Pokémon
                    </p>
                </div>

                <div className="header-actions">
                    <Link to="/poke" className="cta-button">
                        <span className="button-icon">⚔️</span>
                        Ir a Poke
                    </Link>
                </div>
            </header>

            {/* Filtros y Búsqueda */}
            <div className="filters-section">
                <div className="search-container">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Buscar Pokémon por nombre o ID..."
                        value={searchTerm}
                    />
                </div>

                <div className="type-filter-container">
                    <TypeFilter
                        selectedTypes={selectedTypes}
                        onChange={handleTypeFilter}
                    />
                </div>

                {(searchTerm || selectedTypes.length > 0) && (
                    <button
                        onClick={handleResetFilters}
                        className="reset-filters-btn"
                    >
                        <span className="reset-icon">🔄</span>
                        Limpiar filtros
                    </button>
                )}
            </div>

            {/* Estadísticas de filtrado */}
            <div className="filter-stats">
                <span className="stats-item">
                    Mostrando: <strong>{filteredPokemon.length}</strong> Pokémon
                </span>
                {searchTerm && (
                    <span className="stats-item">
                        Búsqueda: <strong>"{searchTerm}"</strong>
                    </span>
                )}
                {selectedTypes.length > 0 && (
                    <span className="stats-item">
                        Tipos: <strong>{selectedTypes.join(", ")}</strong>
                    </span>
                )}
            </div>

            {/* Grid de Pokémon */}
            {filteredPokemon.length > 0 ? (
                <>
                    <div className="pokemon-grid">
                        {filteredPokemon.map((pokemon) => (
                            <PokeCard
                                key={pokemon.id}
                                pokemon={pokemon}
                            />
                        ))}
                    </div>

                    {/* Paginación */}
                    <div className="pagination-section">
                        <div className="pagination-info">
                            Página {currentPage} de {totalPages}
                        </div>

                        <div className="pagination-controls">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="pagination-btn prev-btn"
                            >
                                ← Anterior
                            </button>

                            <div className="page-numbers">
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    const pageNum = Math.max(
                                        1,
                                        Math.min(
                                            currentPage - 2,
                                            totalPages - 4
                                        )
                                    ) + i;

                                    if (pageNum > totalPages) return null;

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`pagination-btn page-btn ${
                                                pageNum === currentPage ? 'active' : ''
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="pagination-btn next-btn"
                            >
                                Siguiente →
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <h3>No se encontraron Pokémon</h3>
                    <p>Intenta con otros términos de búsqueda o tipos diferentes</p>
                    <button
                        onClick={handleResetFilters}
                        className="reset-filters-btn"
                    >
                        Mostrar todos los Pokémon
                    </button>
                </div>
            )}

            {/* Información adicional */}
            <div className="home-info">
                <div className="info-card">
                    <h4>✨ Características</h4>
                    <ul>
                        <li>Detalles completos de cada Pokémon</li>
                        <li>Visualización de versiones Shiny</li>
                        <li>Filtrado por tipos y búsqueda</li>
                        <li>Información de estadísticas base</li>
                    </ul>
                </div>

                <div className="info-card">
                    <h4>⚡ Acciones rápidas</h4>
                    <div className="quick-actions">
                        <Link to="/actividades" className="quick-action-btn">
                            <span>📝</span>
                            Actividades
                        </Link>
                        <Link to="/login" className="quick-action-btn">
                            <span>🔐</span>
                            Iniciar sesión
                        </Link>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="quick-action-btn"
                        >
                            <span>🔄</span>
                            Recargar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;