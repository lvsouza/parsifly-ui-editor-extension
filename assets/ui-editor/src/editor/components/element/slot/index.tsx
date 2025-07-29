import { type MouseEvent, type RefObject } from 'react';
import { type TDropMonitor } from 'react-use-drag-and-drop';

import { type TDraggableElement, type TElement, type TParentElement } from '../../../types';
import { useHasViewOnly } from '../UseHasViewOnly';
import { useSlotRender } from './UseSlotRender';
import { Render } from './Render';
import { Edit } from './Edit';
import { View } from './View';


interface ISlotProps {
  element: TElement<'slot'>;
  parents: TParentElement[];

  onDrop: (data: TDraggableElement, monitor: TDropMonitor, element: TElement<'slot' | 'slot-content'>, parents: TParentElement[], elementRef: RefObject<HTMLElement>, droppableId: string) => void;
  onDragOver: (data: TDraggableElement, monitor: TDropMonitor, element: TElement<'slot' | 'slot-content'>, parents: TParentElement[], elementRef: RefObject<HTMLElement>, droppableId: string) => void;
  onDragLeave: (data: TDraggableElement, monitor: TDropMonitor, element: TElement<'slot' | 'slot-content'>, parents: TParentElement[], elementRef: RefObject<HTMLElement>, droppableId: string) => void;

  onMouseLeave: (event: MouseEvent) => void;
  onSelect: (event: MouseEvent, element: TElement<'slot'>) => void;
  onMouseOver: (event: MouseEvent, element: TElement<'slot' | 'slot-content'>, htmlElement: HTMLElement | null) => void;

  onHoverBar: (element: TElement<'slot'>, htmlElement: HTMLElement | null) => void;
  onSelectBar: (element: TElement<'slot'>, htmlElement: HTMLElement | null) => void;
}
export const Slot = ({ element, parents, ...rest }: ISlotProps) => {
  const hasViewOnly = useHasViewOnly(element, parents);
  const isRender = useSlotRender(element, parents);


  if (isRender) return (
    <Render
      element={element}
      parents={parents}

      onDrop={rest.onDrop}
      onDragOver={rest.onDragOver}
      onDragLeave={rest.onDragLeave}

      onMouseOver={rest.onMouseOver}
      onMouseLeave={rest.onMouseLeave}

      onHoverBar={rest.onHoverBar}
    />
  );

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
