const baseURL = "https://pokeapi.co/api/v2/pokemon/"

export const getList = async (page = 0) => {
    let result = {}
    let quantity = 9
    try {
        const query = await fetch(`${baseURL}?limit=${quantity}&offset=${quantity * page}`)
        const res = await query.json()
        
        if (res.next) {
            result.next = page + 1
        }
        if (res.previous) {
            result.prev = page - 1
        }
        
        result.pokemons = []
        for await (const resultado of res.results) {
            const queryPokemon = await fetch(`${resultado.url}`)
            const pokemon = await queryPokemon.json()
            result.pokemons.push({
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.sprites.other["official-artwork"].front_default, // Imagen oficial
                types: pokemon.types.map(({ type }) => type.name),  // Tipos
                height: pokemon.height / 10,  // Altura en metros (dividido por 10)
                weight: pokemon.weight / 10   // Peso en kilogramos (dividido por 10)
            });
            
            
        }

        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const getOne = async (id) => {
    
}
