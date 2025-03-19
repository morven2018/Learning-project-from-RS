import View from '../../view';
import { isNotNullable } from '../../../util/is-nullable';
import State from '../../../state/state';

import TimerCreator from '../../../util/timer/timer';
import WheelCreator from '../../../util/wheel/wheel';
import ElementCreator from '../../../util/element-creator';
import './wheel.scss';
import sound from '../../../../asserts/sounds/sound.mp3';
import back from '../../../../asserts/icons/back.png';
import sound_on from '../../../../asserts/icons/sound.png';
import sound_off from '../../../../asserts/icons/nosound.png';
import play from '../../../../asserts/icons/play.png';

const SOUND_OFF_URL = sound_off.toString();
const SOUND_ON_URL = sound_on.toString();
const BACK = back.toString();
const PICK = play.toString();

const CssClasses = {
  INDEX: 'picker',
  LIST_CLASS: 'list-of-option',
  INPUT: 'picker__timer',
  BUTTON_SOUND_ON: 'picker__sound-on_button',
  BUTTON_SOUND_OFF: 'picker__sound-off_button',
  BUTTON_BACK: 'picker__back_button',
  CANVAS: 'picker_wheel',
  START: 'Pick',
  PICKED: 'picked_element',
};

const TEXT_CONTENT = {
  TITLE: 'Page is not founded',
  BACK: 'Back',
  INPUT: 'Timer',
  BUTTON_SOUND_ON: 'Sound off',
  BUTTON_SOUND_OFF: 'Sound on',
  BUTTON_START: 'Start',
};

const SOUND_STATE_KEY = 'soundState';

const exampleList = { title: 1, point2: 4, point3: 2, point4: 7, point5: 8 };

export default class PickerView extends View {
  public audio: HTMLAudioElement;
  private isSoundOn: boolean = true;
  private soundButton: HTMLButtonElement | undefined = undefined;
  private soundIcon: HTMLImageElement | undefined = undefined;

  constructor() {
    const parameters = {
      tag: 'section',
      classNames: [CssClasses.INDEX],
    };
    super(parameters);

    this.audio = new Audio(sound);
    this.audio.loop = true;
    this.loadSoundState();
    this.configureView();
  }

  public configureView(): void {
    if (isNotNullable(this.viewElementCreator)) {
      const backButton = this.addButton({
        tag: 'button',
        classNames: [CssClasses.BUTTON_BACK, 'back'],
        textContent: '',
        title: TEXT_CONTENT.BACK,
        callback: (): void => globalThis.history.back(),
        imageURL: BACK,
      });

      const buttonSound = this.addButtonSound({
        tag: 'button',
        classNames: [
          this.isSoundOn
            ? CssClasses.BUTTON_SOUND_ON
            : CssClasses.BUTTON_SOUND_OFF,
        ],
        textContent: '',
        title: this.isSoundOn
          ? TEXT_CONTENT.BUTTON_SOUND_ON
          : TEXT_CONTENT.BUTTON_SOUND_OFF,
        callback: (): void => this.toggleSound(),
        imageURL: this.isSoundOn ? SOUND_ON_URL : SOUND_OFF_URL,
      });
      if (buttonSound instanceof HTMLButtonElement)
        this.soundButton = buttonSound;

      const timerParameters = {
        tag: 'div',
        classNames: [CssClasses.INPUT],
        textContent: '',
      };

      const timer = new TimerCreator(timerParameters);
      this.viewElementCreator.addInnerElement(timer);

      const pickButton = this.addButton({
        tag: 'button',
        classNames: [CssClasses.START],
        textContent: '',
        title: TEXT_CONTENT.BUTTON_START,
        callback: (): void => {
          if (this.isSoundOn) {
            this.audio.play().catch((error) => {
              console.error('Failed to play sound:', error);
            });
          }

          wheel.startAnimation();
        },
        imageURL: PICK,
      });

      const pickedElementParameters = {
        tag: 'p',
        classNames: [CssClasses.PICKED],
        textContent: TEXT_CONTENT.BUTTON_START,
      };
      const pickedElement = new ElementCreator(pickedElementParameters);
      this.viewElementCreator.addInnerElement(pickedElement);

      const wheelParameter = {
        tag: 'canvas',
        classNames: [CssClasses.CANVAS],
        textContent: '',
      };

      const optionList = State.shuffleObject(
        State.getOptionList() || exampleList
      );

      console.log(optionList);

      const onAnimationEnd = (): void => {
        if (this.isSoundOn) {
          this.audio.pause();
          this.audio.currentTime = 0;
        }
      };

      const wheel = new WheelCreator(
        wheelParameter,
        optionList,
        timer,
        pickedElement,
        [backButton?.element, buttonSound, pickButton?.element],
        onAnimationEnd
      );
      this.viewElementCreator.addInnerElement(wheel);
    }
  }

  public addButtonSound(parameters: {
    tag: string;
    classNames: string[];
    textContent: string;
    title: string;
    callback: () => void;
    imageURL: string;
  }): HTMLElement | undefined {
    const button = new ElementCreator({
      tag: parameters.tag,
      classNames: parameters.classNames,
      textContent: parameters.textContent,
    });

    const image = document.createElement('img');
    image.src = parameters.imageURL;
    image.setAttribute('title', parameters.title);
    image.setAttribute('aria-label', parameters.title);

    button.element?.append(image);

    button.element?.addEventListener('click', parameters.callback);

    this.viewElementCreator?.addInnerElement(button);

    this.soundIcon = image;

    return button.getElement();
  }

  private loadSoundState(): void {
    const savedState = localStorage.getItem(SOUND_STATE_KEY);
    if (isNotNullable(savedState)) {
      this.isSoundOn = savedState === 'true';
    }
    this.audio.volume = this.isSoundOn ? 1 : 0;
  }

  private toggleSound(): void {
    this.isSoundOn = !this.isSoundOn;

    localStorage.setItem(SOUND_STATE_KEY, this.isSoundOn.toString());

    this.audio.volume = this.isSoundOn ? 1 : 0;

    if (this.soundButton && this.soundIcon) {
      this.soundIcon.src = this.isSoundOn ? SOUND_ON_URL : SOUND_OFF_URL;

      this.soundButton.classList.toggle(
        CssClasses.BUTTON_SOUND_ON,
        this.isSoundOn
      );
      this.soundButton.classList.toggle(
        CssClasses.BUTTON_SOUND_OFF,
        !this.isSoundOn
      );
      this.soundButton.title = this.isSoundOn
        ? TEXT_CONTENT.BUTTON_SOUND_ON
        : TEXT_CONTENT.BUTTON_SOUND_OFF;
    }
  }
}
