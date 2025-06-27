import { type IObservable } from 'react-observing';

import { type TElement } from './Element';


export type TComponent = {
  id: IObservable<string>;
  content: IObservable<TElement[]>;
}
