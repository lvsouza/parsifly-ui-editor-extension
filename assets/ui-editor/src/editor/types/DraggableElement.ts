import { type TElement, type TElementTypesDefault, type TElementTypesParents, type TParentElement } from './Element';


export type TExternalDraggableElement = {
  id: string;
}

export type TDraggableElement<E extends TElementTypesDefault = TElementTypesDefault, D = any> = {
  element: TElement<E, D>;
  parents: TParentElement<TElementTypesParents, D>[] | null;
}

export type TDropFunctionProps<D = any> = {
  element: TElement<TElementTypesDefault, D> | string;
  from: {
    position: number;
    element: null | 'root' | TElement<'html' | 'slot-content', D>;
  };
  to: {
    position: number;
    element: 'root' | TElement<'html' | 'slot-content', D>;
  }
}
