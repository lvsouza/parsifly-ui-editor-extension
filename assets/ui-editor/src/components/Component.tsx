import { useRef, createElement } from 'react';
import { useDrag } from 'react-use-drag-and-drop';

import type { TExternalDraggableElement } from './../editor';


interface IComponentProps {
  id: string;
  name: string;
}
export const Component = ({ id, name }: IComponentProps) => {
  const htmlRef = useRef<HTMLElement>(null);


  useDrag<TExternalDraggableElement>({
    id: id,
    element: htmlRef,
    data: { id },
  }, [id]);


  return createElement('div', {
    title: name,
    ref: htmlRef,
    style: { border: 'thin solid', padding: 4, whiteSpace: 'nowrap', overflow: 'hidden' }
  }, name);
};
