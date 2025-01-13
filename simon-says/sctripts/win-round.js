import { renderNextRoundButton, renderNewGameButton } from "./buttons.js";

export function renderWinRoundForm(level, round){
    const overlay = document.createElement("div");
    document.querySelector("body").append(overlay);
    overlay.className = "overlay";

    const winForm = document.createElement("div");
    overlay.append(winForm);
    winForm.className = "win-form";

    const outCross = document.createElement("div");
    outCross.className = "win-form__close-btn";
    outCross.textContent = "X";
    winForm.append(outCross);    
    

    const messageBlock = document.createElement("div");    
    winForm.append(messageBlock);
    messageBlock.textContent = `You win ${round} round`;
    messageBlock.className = "win-form__msg";
    
    const buttonBlock = document.createElement("div");    
    winForm.append(buttonBlock);
    buttonBlock.className = "win-form__buttons";
    
    renderNextRoundButton(buttonBlock);        
    renderNewGameButton(buttonBlock); 

}
