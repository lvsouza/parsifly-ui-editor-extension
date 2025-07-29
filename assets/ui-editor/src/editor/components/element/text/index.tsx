import { type MouseEvent, type RefObject } from 'react';
import { type TDropMonitor } from 'react-use-drag-and-drop';

import { type TDraggableElement, type TElement, type TParentElement } from '../../../types';
import { useHasViewOnly } from '../UseHasViewOnly';
import { Edit } from './Edit';
import { View } from './View';


interface ITextProps {
  element: TElement<'text'>;
  parents: TParentElement[];

  onDrop: (data: TDraggableElement, monitor: TDropMonitor, element: TElement<'text'>, parents: TParentElement[], elementRef: RefObject<HTMLElement>, droppableId: string) => void;
  onDragOver: (data: TDraggableElement, monitor: TDropMonitor, element: TElement<'text'>, parents: TParentElement[], elementRef: RefObject<HTMLElement>, droppableId: string) => void;
  onDragLeave: (data: TDraggableElement, monitor: TDropMonitor, element: TElement<'text'>, parents: TParentElement[], elementRef: RefObject<HTMLElement>, droppableId: string) => void;

  onMouseLeave: (event: MouseEvent) => void;
  onSelect: (event: MouseEvent, element: TElement<'text'>) => void;
  onMouseOver: (event: MouseEvent, element: TElement<'text'>, htmlElement: HTMLElement | null) => void;

  onHoverBar: (element: TElement<'text'>, htmlElement: HTMLElement | null) => void;
  onSelectBar: (element: TElement<'text'>, htmlElement: HTMLElement | null) => void;
}
export const Text = ({ element, parents, ...rest }: ITextProps) => {
  const hasViewOnly = useHasViewOnly(element, parents);


  if (hasViewOnly) return (
    <View
      element={element}
      parents={parents}
    />
  );

  return (
    <Edit
      element={element}
      parents={parents}

      onDrop={rest.onDrop}
      onDragOver={rest.onDragOver}
      onDragLeave={rest.onDragLeave}

      onSelect={rest.onSelect}
      onMouseOver={rest.onMouseOver}
      onMouseLeave={rest.onMouseLeave}

      onHoverBar={rest.onHoverBar}
      onSelectBar={rest.onSelectBar}
    />
  );
}
