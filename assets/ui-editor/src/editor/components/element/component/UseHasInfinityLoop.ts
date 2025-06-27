import { useSelectorValue } from 'react-observing';

import { type TElement, type TParentElement } from '../../../types';


/**
 * 
 * @param element Current element
 * @param parents Current element parents
 * @returns If it has or not a infinity loop through components
 */
export const useHasInfinityLoop = (element: TElement<'component'>, parents: TParentElement[]) => {
  /* This can prevent all types of loop in components */
  return useSelectorValue(({ get }) => {
    return parents.map(parent => get(parent.id)).includes(get(element.id));
  }, [element, parents]);
}
