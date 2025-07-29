import { type MouseEvent, type RefObject } from 'react';
import { type TDropMonitor } from 'react-use-drag-and-drop';

import { type TDraggableElement, type TElement, type TParentElement } from '../../../types';
import { useHasInfinityLoop } from './UseHasInfinityLoop';
import { useHasViewOnly } from '../UseHasViewOnly';
import { BreakLoopView } from './BreakLoopView';
import { BreakLoopEdit } from './BreakLoopEdit';
import { Edit } from './Edit';
import { View } from './View';


interface IComponentProps {
  element: TElement<'component'>;
  parents: TParentElement[];

  onDrop: (data: TDraggableElement, monitor: TDropMonitor, element: TElement<'component'>, parents: TParentElement[], elementRef: RefObject<HTMLElement>, droppableId: string) => void;
  onDragOver: (data: TDraggableElement, monitor: TDropMonitor, element: TElement<'component'>, parents: TParentElement[], elementRef: RefObject<HTMLElement>, droppableId: string) => void;
  onDragLeave: (data: TDraggableElement, monitor: TDropMonitor, element: TElement<'component'>, parents: TParentElement[], elementRef: RefObject<HTMLElement>, droppableId: string) => void;

  onMouseLeave: (event: MouseEvent) => void;
  onSelect: (event: MouseEvent, element: TElement<'component'>) => void;
  onDoubleClick: (event: React.MouseEvent, element: TElement<'component'>) => void;
  onMouseOver: (event: MouseEvent, element: TElement<'component'>, htmlElement: HTMLElement | null) => void;

  onHoverBar: (element: TElement<'component'>, htmlElement: HTMLElement | null) => void;
  onSelectBar: (element: TElement<'component'>, htmlElement: HTMLElement | null) => void;
}
export const Component = ({ element, parents, ...rest }: IComponentProps) => {
  const hasInfinityLoop = useHasInfinityLoop(element, parents);
  const hasViewOnly = useHasViewOnly(element, parents);


  if (hasInfinityLoop) {
    /* When infinite loop, when have only view for break loop */
    if (hasViewOnly) return <BreakLoopView element={element} />;

    return <BreakLoopEdit
      element={element}

      onSelect={rest.onSelect}
      onMouseOver={rest.onMouseOver}
      onMouseLeave={rest.onMouseLeave}

      onHoverBar={rest.onHoverBar}
      onSelectBar={rest.onSelectBar}
    />;
  }

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
      onDoubleClick={rest.onDoubleClick}

      onSelect={rest.onSelect}
      onMouseOver={rest.onMouseOver}
      onMouseLeave={rest.onMouseLeave}

      onHoverBar={rest.onHoverBar}
      onSelectBar={rest.onSelectBar}
    />
  );
}
