function setItem(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}

function getItem(key) {
  return JSON.parse(localStorage.getItem(key))
}

function addItemToCollection(key, item) {
  const collection = getItem(key)

  if (Array.isArray(collection)) {
    if (!collection.includes(item)) {
      collection.push(item);

      return setItem(key, collection);
    }
  } else {
    return setItem(key, [item]);
  }
}

const classByType = {
  bug: "bug-class",
  dark: "dark-class",
  dragon: "dragon-class",
  electric: "electric-class",
  fairy: "fairy-class",
  fighting: "fighting-class",
  fire: "fire-class",
  flying: "flying-class",
  ghost: "ghost-class",
  grass: "grass-class",
  ground: "ground-class",
  ice: "ice-class",
  normal: "normal-class",
  poison: "poison-class",
  psychic: "psychic-class",
  rock: "rock-class",
  steel: "steel-class",
  water: "water-class",
};

const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";

/**
 *
 * @param {string | number} id
 * @returns 
 */
async function getPokemon(id) {
  const response = await fetch(`${BASE_URL}${id}`);

  return response.json();
}

class PokemonIdManager {
  /**
   * First Pokemon id.
   *
   * @constant
   */
  FIRST = 1;
  /**
   * Last Pokemon id.
   *
   * @constant
   */
  LAST = 10249;
  /**
   * @constant
   */
  EMPTY_RANGE = 9096;
  /**
   * @constant
   */
  NUMBER_BEFORE_JUMP = 905;
  /**
   * @constant
   */
  NUMBER_AFTER_JUMP = 10001;

  /**
   *
   * @param {number} [initialId]
   */
  constructor(initialId) {
    this.currentId = Number(initialId) || this.FIRST;
  }

  getNext() {
    if (this.currentId >= this.LAST) return null;

    const addend =
      this.currentId === this.NUMBER_BEFORE_JUMP ? this.EMPTY_RANGE : 1;

    this.currentId += addend;

    return this.currentId;
  }

  getPrevious() {
    if (this.currentId <= this.FIRST) return null;

    const subtrahend =
      this.currentId === this.NUMBER_AFTER_JUMP ? this.EMPTY_RANGE : 1;

    this.currentId -= subtrahend;

    return this.currentId;
  }
}

const pokemonIdManager = new PokemonIdManager();

pokemonIdManager.getNext();
pokemonIdManager.getNext();
pokemonIdManager.getPrevious();
pokemonIdManager.getPrevious();
// function* sequentialPokemonID(ID) {
//   while (ID < 10249) {
//     if (ID === 905) {
//       yield ID;
//       ID += 9096;
//     } else {
//       yield ID;
//       ID++;
//     }
//   }
// }
