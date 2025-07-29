import { type MouseEvent, type RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type TDropMonitor, useDrag, useDrop } from 'react-use-drag-and-drop';
import { useObserver, useObserverValue } from 'react-observing';

import { type TDraggableElement, type TElement, type TParentElement } from '../../../types';
import { useUiEditorContext } from '../../../UiEditorContext';
import { getCustomDragLayer, uuid } from '../../../helpers';
import { useMatchEffect } from '../UseMatchEffect';
import { useSelectBar } from '../../select-bar';
import { useInsertBar } from '../../insert-bar';
import { useHoverBar } from '../../hover-bar';


interface IEditProps {
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
export const Edit = ({ element, parents, onMouseOver, onMouseLeave, onSelect, onDragLeave, onDragOver, onDrop, onHoverBar, onSelectBar }: IEditProps) => {
  const elementRef = useRef<HTMLElement>(null);

  const [text, setText] = useObserver(element.text);
  const name = useObserverValue(element.name);
  const id = useObserverValue(element.id);

  const { onExpressionToValue, onValueToExpression } = useUiEditorContext();
  const { onDragStart, onDragEnd } = useUiEditorContext();
  const { hideInsertBar } = useInsertBar();
  const { selectedId } = useSelectBar();
  const { hoveredId } = useHoverBar();


  const [editable, setEditable] = useState(false);
  useEffect(() => {
    if (!elementRef.current || !editable) return;
    elementRef.current.focus();
    onSelectBar(element, null)
  }, [editable, onSelectBar]);


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
    canDrag: !editable,
    element: elementRef,
    data: { element, parents, },
    start: () => { onDragStart() },
    end: () => { hideInsertBar(); onDragEnd(); },
  }, [id, editable, element, parents, hideInsertBar, onDragStart, onDragEnd]);
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


  const handleFocus = useCallback((e: React.FormEvent<HTMLSpanElement>) => {
    if (!window || !document) return;

    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    const span = e.currentTarget;

    range.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLSpanElement>) => {
    e.stopPropagation();

    if (e.code === 'Escape' || e.code === 'Enter' || e.code === 'NumpadEnter') {
      e.currentTarget.blur();
      onSelectBar(element, e.currentTarget)
    }
  }, [onSelectBar, element]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLSpanElement>) => {
    setEditable(false);
    setText(String(onValueToExpression(e.currentTarget.innerText, 'text', 'textContent', element)));
    onSelectBar(element, e.currentTarget)
  }, [onSelectBar, onValueToExpression, element]);


  const renderedText = useMemo(() => {
    return onExpressionToValue(text, 'text', 'textContent', element) ?? '';
  }, [text, onExpressionToValue, element]);


  return (
    <span
      contentEditable={editable}
      dangerouslySetInnerHTML={{ __html: renderedText }}

      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onDoubleClick={() => setEditable(true)}

      ref={elementRef}
      onMouseLeave={onMouseLeave}
      onClick={e => !editable ? onSelect(e, element) : e.stopPropagation()}
      onMouseOver={e => !editable ? onMouseOver(e, element, elementRef.current) : e.stopPropagation()}
      style={{
        resize: 'none',
        cursor: 'default',
        pointerEvents: 'all',

        opacity: isDragging ? 0.5 : undefined,
        borderRadius: editable ? 4 : undefined,
        boxShadow: editable ? '0 0 6px 2px orange' : undefined,
      }}
    />
  );
};
