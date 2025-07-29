import { type MouseEvent, type RefObject, useRef } from 'react';
import { type TDropMonitor, useDrop } from 'react-use-drag-and-drop';

import { type TDraggableElement, type TElement, type TParentElement } from '../../../types';
import { useMatchEffect } from '../UseMatchEffect';
import { useSlotContent } from './UseSlotContent';
import { useHoverBar } from '../../hover-bar';
import { uuid } from '../../../helpers';
import { Element } from '..';


interface IRenderProps {
  element: TElement<'slot'>;
  parents: TParentElement[];

  onDrop: (data: TDraggableElement, monitor: TDropMonitor, element: TElement<'slot-content'>, parents: TParentElement[], elementRef: RefObject<HTMLElement>, droppableId: string) => void;
  onDragOver: (data: TDraggableElement, monitor: TDropMonitor, element: TElement<'slot-content'>, parents: TParentElement[], elementRef: RefObject<HTMLElement>, droppableId: string) => void;
  onDragLeave: (data: TDraggableElement, monitor: TDropMonitor, element: TElement<'slot-content'>, parents: TParentElement[], elementRef: RefObject<HTMLElement>, droppableId: string) => void;

  onMouseLeave: (event: MouseEvent) => void;
  onMouseOver: (event: MouseEvent, element: TElement<'slot-content'>, htmlElement: HTMLElement | null) => void;

  onHoverBar: (element: TElement<'slot'>, htmlElement: HTMLElement | null) => void;
}
export const Render = ({ element, parents, onMouseOver, onMouseLeave, onDragLeave, onDragOver, onDrop, onHoverBar }: IRenderProps) => {
  const elementRef = useRef<HTMLDivElement>(null);


  const [content = [], currentSlotContent] = useSlotContent(element, parents);
  const { hoveredId } = useHoverBar();


  useMatchEffect({
    value: hoveredId,
    matchWidthValue: currentSlotContent?.id,
    effect() {
      if (!currentSlotContent) return;
      onHoverBar(element, elementRef.current);
    },
  }, [hoveredId, currentSlotContent?.id, element]);


  const droppableId = useRef({ id: uuid() });
  useDrop({
    element: elementRef,
    id: droppableId.current.id,
    drop: (data, monitor) => currentSlotContent ? onDrop(data, monitor, currentSlotContent, parents, elementRef as any, droppableId.current.id) : undefined,
    hover: (data, monitor) => currentSlotContent ? onDragOver(data, monitor, currentSlotContent, parents, elementRef as any, droppableId.current.id) : undefined,
    leave: (data, monitor) => currentSlotContent ? onDragLeave(data, monitor, currentSlotContent, parents, elementRef as any, droppableId.current.id) : undefined,
  }, [currentSlotContent, parents, onDrop, onDragOver, onDragLeave]);


  return (
    <div
      ref={elementRef}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'default', userSelect: 'none', pointerEvents: 'all', outline: 'none', }}
      onMouseOver={e => currentSlotContent ? onMouseOver(e, currentSlotContent, elementRef.current) : undefined}
    >
      {currentSlotContent && content.length > 0 && content.map((contentItem) => (
        <Element
          key={contentItem.id.value}
          element={contentItem}
          parents={[...parents, currentSlotContent]}
        />
      ))}
      {content.length === 0 && (
        <div
          style={{
            opacity: 0.5,
            display: 'flex',
            minWidth: '40px',
            minHeight: '40px',
            alignItems: 'center',
            pointerEvents: 'none',
            justifyContent: 'center',
            fontFamily: 'sans-serif',
            backgroundColor: '#80808020',
          }}
        >
          Drag and drop something here...
        </div>
      )}
    </div>
  );
};
