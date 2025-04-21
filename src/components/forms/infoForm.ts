import { CssClasses, CssTags } from '../../lib/types/enums';
import { IElementParameters } from '../../lib/types/interfaces';
import ButtonCreator from '../button';
import ElementCreator from '../element-creator';

const buttonParameters = {
  tag: CssTags.Button,
  classNames: [CssClasses.CloseButton],
  textContent: 'Close',
};

export default class InfoForm extends ElementCreator {
  constructor(parameters: IElementParameters) {
    super(parameters);
    this.setTextContent(parameters.textContent);
    const closeButton = new ButtonCreator({
      ...buttonParameters,
      callback: () => this.element?.remove(),
    });
    this.addInnerElement(closeButton);
  }
}
