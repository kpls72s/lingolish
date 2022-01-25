import { lists } from "./list.js";

 export function randomWord() {
    let maxSelect = lists.length;
    const index = Math.floor(Math.random() * maxSelect);
    return lists[index];
  }

  export function disabledKeys(){
        let Keys = Array.from(document.querySelectorAll('.keys'));
        Keys.forEach(key => {key.classList.toggle('blureKeys')});
  }

  export function setGameLevel(element){
    const mainCover = document.getElementsByClassName('main-cover')[0];

      let Gamelevel = "";
      Gamelevel = element.value;
      let label = element.nextElementSibling;
      label.classList.add('radioButtonDisabled')
      mainCover.classList.add('mainCoverHidden');
      return Gamelevel;

  }