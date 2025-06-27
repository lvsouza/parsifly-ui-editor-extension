import { useSelectorValue } from 'react-observing';

import { useUiEditorContext } from '../../../UiEditorContext';
import { type TElement, type TParentElement } from '../../../types';


export const useSlotContent = (element: TElement<'slot'>, parents: TParentElement[]): [] | [TElement[], TElement<'slot-content'>] => {
  const { onAddSlotContent } = useUiEditorContext();


  return useSelectorValue(({ get }) => {
    const referenceComponent = [...parents].reverse()
      .filter(parent => get(parent.type) === 'component')
      .find(parent => get((parent as TElement<'component'>).referenceComponentId) === get(element.componentId)) as TElement<'component'> | undefined;

    if (!referenceComponent) return [];

    const currentSlot = get(referenceComponent.slots)?.find(slot => get(slot.referenceSlotId) === get(element.id));
    if (!currentSlot) {
      setTimeout(() => onAddSlotContent(element, referenceComponent), 0);
      return [];
    }

    return [get(currentSlot.children), currentSlot];
  }, [parents, element, onAddSlotContent]);
}
