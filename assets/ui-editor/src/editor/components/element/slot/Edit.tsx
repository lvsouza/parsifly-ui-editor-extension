import { type MouseEvent, type RefObject, useEffect, useRef } from 'react';
import { type TDropMonitor, useDrag, useDrop } from 'react-use-drag-and-drop';
import { useObserverValue } from 'react-observing';

import { type TDraggableElement, type TElement, type TParentElement } from '../../../types';
import { useUiEditorContext } from '../../../UiEditorContext';
import { getCustomDragLayer, uuid } from '../../../helpers';
import { useMatchEffect } from '../UseMatchEffect';
import { useInsertBar } from '../../insert-bar';
import { useSelectBar } from '../../select-bar';
import { useHoverBar } from '../../hover-bar';


interface IEditProps {
  element: TElement<'slot'>;
  parents: TParentElement[];

  onDrop: (data: TDraggableElement, monitor: TDropMonitor, element: TElement<'slot'>, parents: TParentElement[], elementRef: RefObject<HTMLElement>, droppableId: string) => void;
  onDragOver: (data: TDraggableElement, monitor: TDropMonitor, element: TElement<'slot'>, parents: TParentElement[], elementRef: RefObject<HTMLElement>, droppableId: string) => void;
  onDragLeave: (data: TDraggableElement, monitor: TDropMonitor, element: TElement<'slot'>, parents: TParentElement[], elementRef: RefObject<HTMLElement>, droppableId: string) => void;

  onMouseLeave: (event: MouseEvent) => void;
  onSelect: (event: MouseEvent, element: TElement<'slot'>) => void;
  onMouseOver: (event: MouseEvent, element: TElement<'slot'>, htmlElement: HTMLElement | null) => void;

  onHoverBar: (element: TElement<'slot'>, htmlElement: HTMLElement | null) => void;
  onSelectBar: (element: TElement<'slot'>, htmlElement: HTMLElement | null) => void;
}
export const Edit = ({ element, parents, onMouseOver, onMouseLeave, onSelect, onDragLeave, onDragOver, onDrop, onHoverBar, onSelectBar }: IEditProps) => {
  const elementRef = useRef<HTMLDivElement>(null);


  const { onDragStart, onDragEnd } = useUiEditorContext();
  const { hideInsertBar } = useInsertBar();
  const { selectedId } = useSelectBar();
  const { hoveredId } = useHoverBar();


  const name = useObserverValue(element.name);
  const id = useObserverValue(element.id);


  useMatchEffect({
    value: hoveredId,
    matchWidthValue: element?.id,
    effect: () => onHoverBar(element, elementRef.current),
  }, [hoveredId, element]);

  useMatchEffect({
    value: selectedId,
    matchWidthValue: element?.id,
    effect: () => onSelectBar(element, elementRef.current),
  }, [selectedId, element]);


  const { isDragging, preview } = useDrag<TDraggableElement>({
    id,
    element: elementRef,
    data: { element, parents },
    start: () => { onDragStart() },
    end: () => { hideInsertBar(); onDragEnd(); },
  }, [id, element, parents, hideInsertBar, onDragStart, onDragEnd]);
  useEffect(() => {
    preview(
      () => getCustomDragLayer(name),
      (customDragLayer) => customDragLayer.remove(),
    );
  }, [preview, name]);

  const droppableId = useRef({ id: uuid() });
  useDrop({
    element: elementRef,
    id: droppableId.current.id,
    drop: (data, monitor) => onDrop(data, monitor, element, parents, elementRef as any, droppableId.current.id),
    hover: (data, monitor) => onDragOver(data, monitor, element, parents, elementRef as any, droppableId.current.id),
    leave: (data, monitor) => onDragLeave(data, monitor, element, parents, elementRef as any, droppableId.current.id),
  }, [element, parents, onDrop, onDragOver, onDragLeave]);


  return (
    <div
      ref={elementRef}
      onMouseLeave={onMouseLeave}
      onClick={e => onSelect(e, element)}
      onMouseOver={e => onMouseOver(e, element, elementRef.current)}
      style={{
        display: 'flex',
        minWidth: '40px',
        minHeight: '40px',
        cursor: 'default',
        userSelect: 'none',
        alignItems: 'center',
        pointerEvents: 'all',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        backgroundColor: '#8080803b',
        border: '2px dashed #8080803b',
        opacity: isDragging ? 0.5 : undefined,
      }}
    >Slot "{name}"</div>
  );
};
