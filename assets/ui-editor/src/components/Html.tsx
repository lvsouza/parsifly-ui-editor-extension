import { useRef, createElement } from 'react';
import { useDrag } from 'react-use-drag-and-drop';

import type { TExternalDraggableElement } from './../editor';


interface IHtmlProps {
  tag: string;
}
export const Html = ({ tag }: IHtmlProps) => {
  const htmlRef = useRef<HTMLElement>(null);


  useDrag<TExternalDraggableElement>({
    id: tag,
    element: htmlRef,
    data: { id: tag },
  }, [tag]);


  return createElement('div', { ref: htmlRef, style: { border: 'thin solid', padding: 4 } }, tag);
};
