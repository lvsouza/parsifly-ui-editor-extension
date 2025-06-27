import { useSelectorValue } from 'react-observing';

import { type TElement, type TParentElement } from '../../types';


/**
 * 
 * @param element Current element
 * @param parents Current element parents
 * @returns If it has or not view only
 */
export const useHasViewOnly = (element: TElement, parents: TParentElement[]) => {

  const isViewOnly = useSelectorValue(({ get }) => {
    const revercedParents = [...parents].reverse();

    let result: boolean | undefined = undefined;

    for (let index = 0; index < revercedParents.length; index++) {
      const parentElement = revercedParents[index];

      if (get(parentElement.type) === 'slot-content') {
        result = false;
      }

      if (get(parentElement.type) === 'component') {
        if (result === false) result = undefined;
        else return true;
      }
    }

    return !!result;
  }, [parents, element]);

  return isViewOnly;
}
