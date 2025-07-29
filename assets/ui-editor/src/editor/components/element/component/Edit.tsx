import { type MouseEvent, type RefObject, useEffect, useMemo, useRef } from 'react';
import { useObserverValue, useSelectorValue } from 'react-observing';
import { type TDropMonitor, useDrag, useDrop } from 'react-use-drag-and-drop';

import { type TDraggableElement, type TElement, type TParentElement } from '../../../types';
import { useUiEditorContext } from '../../../UiEditorContext';
import { getCustomDragLayer, uuid } from '../../../helpers';
import { useMatchEffect } from '../UseMatchEffect';
import { useSelectBar } from '../../select-bar';
import { useInsertBar } from '../../insert-bar';
import { useHoverBar } from '../../hover-bar';
import { Element } from '..';


interface IEditProps {
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
export const Edit = ({ element, parents, onMouseOver, onMouseLeave, onSelect, onDragLeave, onDragOver, onDrop, onHoverBar, onSelectBar, onDoubleClick }: IEditProps) => {
  const elementRef = useRef<HTMLDivElement>(null);


  const { onDragStart, onDragEnd, components } = useUiEditorContext();
  const { hideInsertBar } = useInsertBar();
  const { selectedId } = useSelectBar();
  const { hoveredId } = useHoverBar();


  const name = useObserverValue(element.name);
  const id = useObserverValue(element.id);
  const children = useSelectorValue(({ get }) => {
    const component = get(components).find(component => get(component.id) === get(element.referenceComponentId));
    if (!component) return [];

    return get(component.content);
  }, [components, element]);


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


  const elementChildren = useMemo(() => {
    if (!children || children.length === 0) return null;

    return children.map(child => (
      <Element
        element={child}
        key={child.id.value}
        parents={[...parents, element]}
      />
    ));
  }, [children, parents, element]);


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
      onDoubleClick={e => onDoubleClick(e, element)}
      onMouseOver={e => onMouseOver(e, element, elementRef.current)}
      style={{ cursor: 'default', userSelect: 'none', pointerEvents: 'all', opacity: isDragging ? 0.5 : undefined }}
    >{elementChildren}</div>
  );
};
