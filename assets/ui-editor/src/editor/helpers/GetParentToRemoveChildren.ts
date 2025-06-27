import { type TParentElement, type TElement } from '../types';


export const getParentToRemoveChildren = (parents: TParentElement[]): TElement<'html' | 'slot-content'> | undefined => {
  let parent: TParentElement | undefined = undefined;
  let count = 0;

  if (!parents || parents.length === 0) return undefined;

  do {
    count--;
    parent = parents?.slice(count).at(0);
  } while (!parent || !['html', 'slot-content'].includes(parent.type.value));


  return parent as TElement<'html' | 'slot-content'> | undefined;
}
