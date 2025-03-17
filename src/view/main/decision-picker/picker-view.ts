import View from '../../view';
import { isNotNullable } from '../../../util/is-nullable';
import type State from '../../../state/state';
// import type { OptionType } from '../../../types/types';
// import ElementCreator from '../../../util/element-creator';
import TimerCreator from '../../../util/timer/timer';
import WheelCreator from '../../../util/wheel/wheel';
import ElementCreator from '../../../util/element-creator';
// import sound from '../../../../asserts/sounds/sound.mp3';

const CssClasses = {
  INDEX: 'index',
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

// const PAGE = 'decision-picker';

const exampleList = { title: 1, point2: 4, point3: 2, point4: 7, point5: 8 };
// const audio = new Audio(sound);

export default class PickerView extends View {
  constructor(state: State) {
    console.log(state);
    const parameters = {
      tag: 'section',
      classNames: [CssClasses.INDEX],
    };
    super(parameters);
    this.configureView();
  }

  public configureView(): void {
    if (isNotNullable(this.viewElementCreator)) {
      this.viewElementCreator.setTextContent(Object.keys(exampleList).join(''));

      this.addButton({
        tag: 'button',
        classNames: [CssClasses.BUTTON_BACK, 'back'],
        textContent: TEXT_CONTENT.BACK,
        callback: (): void => globalThis.history.back(),
        imageURL: '',
      });

      this.addButton({
        tag: 'button',
        classNames: [CssClasses.BUTTON_SOUND_ON],
        textContent: TEXT_CONTENT.BUTTON_SOUND_ON,
        callback: (): void => {},
        imageURL: '',
      });

      const timerParameters = {
        tag: 'div',
        classNames: [CssClasses.INPUT],
        textContent: '',
      };

      const timer = new TimerCreator(timerParameters);
      this.viewElementCreator.addInnerElement(timer);

      this.addButton({
        tag: 'button',
        classNames: [CssClasses.START],
        textContent: TEXT_CONTENT.BUTTON_START,
        callback: (): void => wheel.startAnimation(),
        imageURL: '',
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

      const wheel = new WheelCreator(
        wheelParameter,
        exampleList,
        timer,
        pickedElement
      );
      this.viewElementCreator.addInnerElement(wheel);
    }
  }
}
