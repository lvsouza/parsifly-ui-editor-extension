import { useSelectorValue } from 'react-observing';

import { useUiEditorContext } from '../../../UiEditorContext';
import { type TElement, type TParentElement } from '../../../types';


export const useSlotRender = (element: TElement<'slot'>, parents: TParentElement[]): boolean => {
  const { components: componentsObservable } = useUiEditorContext();


  return useSelectorValue(({ get }) => {
    const components = get(componentsObservable);
    const reverseParents = [...parents].reverse();


    const ownerIndex = reverseParents.findIndex((parent) => {
      if (get(parent.type) !== 'component') return false;

      const parentAsComponent = parent as TElement<'component'>;

      const isSomeId = get(element.componentId) === get(parentAsComponent.referenceComponentId)
      if (!isSomeId) return false;

      return get(parentAsComponent.slots)?.some(slot => get(slot.referenceSlotId) === get(element.id));
    });


    const owner = reverseParents.at(ownerIndex);
    if (!owner) return false;


    const ownerIsViewOnly = reverseParents.slice(ownerIndex + 1).reduce((previous, parent) => {
      if (previous !== undefined) return previous;

      if (get(parent.type) === 'slot-content') return false;
      if (get(parent.type) === 'component') return true;

      return previous;
    }, undefined as boolean | undefined);

    if (ownerIsViewOnly) return false;


    return components.some(component => get(component.id) === get(element.componentId));
  }, [parents, element, componentsObservable]);
}
