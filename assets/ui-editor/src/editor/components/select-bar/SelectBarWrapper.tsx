import { memo, useCallback, useEffect, useRef } from "react";
import { VscArrowUp, VscTrash, VscMove, VscFiles } from "react-icons/vsc";
import { useObserverValue, useSelectorValue } from "react-observing";
import { useDrag } from 'react-use-drag-and-drop';

import { useUiEditorContext } from '../../UiEditorContext';
import { type TDraggableElement, type TElement } from '../../types';
import { getCustomDragLayer } from '../../helpers';
import { useSelectBar } from './UseSelectBar';
import { useInsertBar } from '../insert-bar';
import { SelectBar } from "./SelectBar";


export const SelectBarWrapper: React.FC = memo(() => {
  const refToDrag = useRef<HTMLDivElement>(null);


  const { onDragStart, onDragEnd, onDuplicate, onRemove } = useUiEditorContext();
  const { hideInsertBar } = useInsertBar();
  const {
    select,
    selectedId: selectedIdObservable,
    selectedElement: selectedElementObservable,
    selectBarGetPosition: selectBarGetPositionObserver,
    selectedElementParents: selectedElementParentsObservable,
    selectBarDocumentVerticalScroll: documentVerticalScrollObserver,
    selectBarDocumentHorizontalScroll: documentHorizontalScrollObserver,
  } = useSelectBar();


  const selectedElementParents = useObserverValue(selectedElementParentsObservable);
  const selectedElement = useObserverValue(selectedElementObservable);
  const selectedId = useObserverValue(selectedIdObservable);
  const name = useSelectorValue(({ get }) => {
    if (!selectedElement) return '';
    return get(selectedElement.name);
  }, [selectedElement]);


  const { width, height, top, left } = useSelectorValue(({ get }) => {
    const documentHorizontalScroll = get(documentHorizontalScrollObserver);
    const documentVerticalScroll = get(documentVerticalScrollObserver);
    const getPosition = get(selectBarGetPositionObserver);


    if (!getPosition) return {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    };

    return {
      width: getPosition().width,
      height: getPosition().height,
      top: getPosition().top - documentVerticalScroll,
      left: getPosition().left - documentHorizontalScroll,
    };
  }, [documentHorizontalScrollObserver, documentVerticalScrollObserver, selectBarGetPositionObserver]);


  const handleSelectParent = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    const parent = selectedElementParents?.slice(-1).at(0);

    if (parent) {
      if (parent.type.value === 'slot-content') {
        const component = selectedElementParents?.find(componentParent => {
          if (componentParent.type.value !== 'component') return false;

          return (componentParent as TElement<'component'>).slots.value?.some(slot => slot.id.value === (parent as TElement<'slot-content'>).id.value);
        });

        select(component?.id.value);
      } else {
        select(parent.id.value);
      }
    }
  }, [select, selectedElementParents]);

  const handleRemove = useCallback(() => {
    if (selectedElement) onRemove(selectedElement);
  }, [onRemove, selectedElement]);

  const handleDuplicate = useCallback(() => {
    if (selectedElement) onDuplicate(selectedElement);
  }, [onDuplicate, selectedElement]);


  const { preview, isDragging } = useDrag<TDraggableElement>({
    element: refToDrag,
    id: selectedId || 'default',
    start: () => { onDragStart() },
    end: () => { hideInsertBar(); onDragEnd(); },
    canDrag: !!selectedElement && Array.isArray(selectedElementParents),
    data: {
      element: selectedElement,
      parents: selectedElementParents
    } as TDraggableElement,
  }, [selectedId, selectedElement, selectedElementParents, hideInsertBar, onDragStart, onDragEnd]);
  useEffect(() => {
    preview(
      () => getCustomDragLayer(name),
      (customDragLayer) => customDragLayer.remove(),
    );
  }, [preview, name]);


  if (!selectedId || (width === 0 && height === 0 && left === 0 && top === 0)) return null;

  return (
    <SelectBar
      zIndex={1}
      top={top - 1}
      width={width}
      height={height}
      left={left - 1}
      color="#4a87ee"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', wordBreak: 'keep-all' }}>
        {name}

        {!isDragging && (
          <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            {selectedElementParents && selectedElementParents.length > 0 && <VscArrowUp title="Select parent" onClick={handleSelectParent} style={{ cursor: 'pointer', width: 14, height: 14 }} />}
            <VscTrash title="Remove element" onClick={handleRemove} style={{ cursor: 'pointer', width: 14, height: 14 }} />
            <VscFiles title="Duplicate element and children" onClick={handleDuplicate} style={{ cursor: 'pointer', width: 14, height: 14 }} />
            <span ref={refToDrag} title="Drag element" style={{ display: 'flex', cursor: 'move' }}>
              <VscMove style={{ width: 14, height: 14, pointerEvents: 'none' }} />
            </span>
          </div>
        )}
      </div>
    </SelectBar>
  );
});
