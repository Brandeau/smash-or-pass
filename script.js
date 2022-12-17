/**
 * Api URL
 * @constant
 */
const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";

/**
 * HTML main element
 * @type {HTMLElement}
 */
const MAIN_CONTAINER = document.getElementById("main");

/**
 * HTML results element
 * @type {HTMLButtonElement}
 */
const RESULTS = document.getElementById("results");

/**
 * Pokeball sound
 * @type {Audio}
 */
const CAPTURED_SOUND = new Audio("pokeball_sound.mp3");

/**
 * Pass sound
 * @type {Audio}
 */
const REJECT_SOUND = new Audio("reject_sound.mp3");

/**
 * Undo sound
 * @type {Audio}
 */
const UNDO_SOUND = new Audio("undo_sound.mp3");

/**
 * HTML smash element
 * @type {HTMLButtonElement}
 */
const SMASH_BUTTON = document.getElementById("smash");

/**
 * HTML pass element
 * @type {HTMLButtonElement}
 */
const PASS_BUTTON = document.getElementById("pass");

/**
 * HTML undo element
 * @type {HTMLButtonElement}
 */
const UNDO_BUTTON = document.getElementById("undo");

/**
 * Background colors for the card according to type of Pokemon
 */
const typesToColor = {

      normal      :     "#A8A77A",
      fire        :     "#EE8130",
      water       :     "#6390F0",
      electric    :     "#F7D02C",
      grass       :     "#7AC74C",
      ice         :     "#96D9D6",
      fighting    :     "#C22E28",
      poison      :     "#A33EA1",
      ground      :     "#E2BFC5",
      flying      :     "#A98FF3",
      psychic     :     "#F95587",
      bug         :     "#A6B91A",
      rock        :     "#B6A136",
      ghost       :     "#735797",
      dragon      :     "#6F35FC",
      dark        :     "#705746",
      steel       :     "#B7B7CE",
      fairy       :     "#D685AD"

}

/**
 * Fetches data from Pokeapi
 * @param {string|number} id 
 * @returns {Promise<Object>}
 */
async function getPokemon(id){
      const response = await fetch(`${BASE_URL}${id}`);
      return response.json();

}

/**
 * Gets Pokemon moves
 * @param {array} movesArray 
 * @returns {string}
 */
function getMoves(movesArray){
      if(movesArray.length === 1){
            return `Some of my moves are: ${movesArray[0].move.name}`;
      }else if(movesArray.length === 2){
            return `Some of my moves are: ${movesArray[0].move.name}, and ${movesArray[1].move.name}`;
      }else if(movesArray.length === 0){
            return;
      }

      return `Some of my moves are: ${movesArray[0].move.name}, ${movesArray[1].move.name}, and ${movesArray[2].move.name}`;
      
 
}

/**
 * Gets Pokemon image
 * @param {array} sprites 
 * @returns {HTMLImageElement}
 */
function getImage(sprites){

      if(sprites['other']['dream_world']['front_default'] === null){
            return sprites['other']['official-artwork']['front_default'];
      }

      return sprites['other']['dream_world']['front_default'];
}

/**
 * Changes class for type of Pokemon
 * @param {string} pokemonType 
 * @returns {string}
 */
function changeMainClass(pokemonType){

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

      return classByType[pokemonType];
}

/**
 * Injects each Pokemon's info into the HTML
 * @param {number|string} id 
 * returns {void}
 */
async function injectPokemonInfo(id){
      const data = await getPokemon(id);
      const moves = getMoves(data.moves);
      const type = data['types'][0]['type']['name'];
      const name = data['name'].toUpperCase();
      
      document.getElementById("name-and-type").textContent = `${name}, ${type}`;
      document.getElementById("pokemon-image").src = getImage(data.sprites);
      document.getElementById("moveset").textContent = moves;
      
      MAIN_CONTAINER.className = changeMainClass(type);
      MAIN_CONTAINER.dataset.id = id;
}

/**
 * Class to generate the IDs for the cards
 */
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
        this.currentId = initialId || this.FIRST;
      }
      /**
       * Generates the next ID
       * @returns {number} id
       */
      getNext() {
        if (this.currentId >= this.LAST) return null;
    
        const addend =
          this.currentId === this.NUMBER_BEFORE_JUMP ? this.EMPTY_RANGE : 1;
    
        this.currentId += addend;
    
        return this.currentId;
      }
    
      /**
       * Generates the previous ID
       * @returns {number} id
       */
      getPrevious() {
        if (this.currentId <= this.FIRST) return null;
    
        const subtrahend =
          this.currentId === this.NUMBER_AFTER_JUMP ? this.EMPTY_RANGE : 1;
    
        this.currentId -= subtrahend;
    
        return this.currentId;
      }
    }

/**
 * Handles the clicking of the Smash button
 */
function handleClickSmash(){

      injectPokemonInfo(pokemonIdManager.getNext());
      addItemToCollection('smashedPokemon', MAIN_CONTAINER.dataset.id);
      saveLastPokemonId('lastPokemonId', MAIN_CONTAINER.dataset.id);
      CAPTURED_SOUND.play()

}

/**
 * Handles the clicking of the Pass button
 */
function handleClickPass(){

      injectPokemonInfo(pokemonIdManager.getNext());
      addItemToCollection('passedPokemon', MAIN_CONTAINER.dataset.id);
      saveLastPokemonId('lastPokemonId', MAIN_CONTAINER.dataset.id);
      REJECT_SOUND.play();
}

/**
 * Handles the clicking of the Undo button
 */
function handleClickUndo(){

      injectPokemonInfo(pokemonIdManager.getPrevious());
      erasePokemonFromStorage();
      UNDO_SOUND.play();
}

/**
 * Sets an item into the local storage
 * @param {string} key 
 * @param {array} value 
 * @returns {undefined}
 */
function setItem(key, value) {
      return localStorage.setItem(key, JSON.stringify(value));
    }

/**
 * Gets item from local storage
 * @param {string} key 
 * @returns {array}
 */
function getItem(key) {
      return JSON.parse(localStorage.getItem(key))
    }

/**
 * Adds items to the array to be stored in the local storage
 * @param {string} key 
 * @param {number} item 
 * @returns {}
 */
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

/**
 * Stores the last pokemon's ID into the local storage
 * @param {string} key 
 * @param {number} value 
 * @returns {undefined}
 */
function saveLastPokemonId(key, value){

      return localStorage.setItem(key, value);
}

/**
 * Gets last pokemon's ID from the local storage
 * @returns {number}
 */
function getLastPokemonId(){

      return localStorage.getItem('lastPokemonId');
     
    
}

/**
 * Gets the current pokemon's ID
 * @returns {number}
 */
function getCurrentPokemonId(){

      let lastPokemonId = Number(getLastPokemonId());
      lastPokemonId++;

      return lastPokemonId;
}

/**
 * Erases a Pokemon from the local storage
 */
function erasePokemonFromStorage(){

      let lastPokemonId = getLastPokemonId();
      let currentSmashedArray = getItem('smashedPokemon');
      let currentPassedArray = getItem('passedPokemon');

      if(currentSmashedArray.includes(lastPokemonId)){
            
            currentSmashedArray.pop();
            setItem('smashedPokemon', currentSmashedArray);
      }else{
            currentPassedArray.pop();
            setItem('passedPokemon', currentPassedArray);
      }
      lastPokemonId = lastPokemonId > 1? lastPokemonId - 1: 0;
      saveLastPokemonId('lastPokemonId', lastPokemonId);
}

/**
 * Shows the results of the game
 * @returns {string}
 */
function showResults(){

      let smashedPokemon = getItem('smashedPokemon');
      let passedPokemon = getItem('passedPokemon');

      return `You smashed ${smashedPokemon} and passed ${passedPokemon}`;
}


const pokemonIdManager = new PokemonIdManager(getCurrentPokemonId());

injectPokemonInfo(pokemonIdManager.currentId);

RESULTS.addEventListener('click', () => alert(showResults()));
SMASH_BUTTON.addEventListener('click', () => {handleClickSmash()});
PASS_BUTTON.addEventListener('click', () => {handleClickPass()});
UNDO_BUTTON.addEventListener('click', () => {handleClickUndo()});

