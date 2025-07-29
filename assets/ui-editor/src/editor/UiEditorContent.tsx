import { useCallback, useRef, useState } from 'react';
import { type TDropMonitor, useDrop } from 'react-use-drag-and-drop';
import { useObserverValue } from 'react-observing';

import { SelectBarWrapper, useSelectBar } from './components/select-bar';
import { type TDraggableElement, type TExternalDraggableElement } from './types';
import { ContentFrame } from './components/custom-frame/ContentFrame';
import { HoverBarWrapper, useHoverBar } from './components/hover-bar';
import { CustomFrame } from './components/custom-frame/CustomFrame';
import { InsertBar, useInsertBar } from './components/insert-bar';
import { getParentToRemoveChildren, uuid } from './helpers';
import { useUiEditorContext } from './UiEditorContext';
import { Element } from './components/element';


export const UIEditorContent = () => {
  const droppableId = useRef({ id: uuid() });

  const { value, styles, onDrop, onKeyDown } = useUiEditorContext();
  const { updateSelectBarScroll, select } = useSelectBar();
  const { showInsertBar, hideInsertBar } = useInsertBar();
  const { updateHoverBarScroll, hover } = useHoverBar();


  const [frameDocumentRef, setFrameDocumentRef] = useState<Document | null>(null);
  const content = useObserverValue(value);


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDrop = useCallback((data: TDraggableElement | TExternalDraggableElement | undefined, _: TDropMonitor) => {
    hideInsertBar();
    if (!data) return;

    if (Object.keys(data).includes('id')) {
      const droppedData = data as TExternalDraggableElement;

      onDrop({
        element: droppedData.id,
        from: {
          position: -1,
          element: null,
        },
        to: {
          element: 'root',
          position: value.value.length,
        },
      });
    } else {
      const droppedData = data as TDraggableElement;

      const parentToRemoveTheElement = getParentToRemoveChildren(droppedData.parents || []);
      const elementFrom = !parentToRemoveTheElement ? 'root' : parentToRemoveTheElement;
      const indexToRemove = parentToRemoveTheElement?.children.value?.findIndex(child => child.id.value === droppedData.element.id.value) ?? -1;

      onDrop({
        element: droppedData.element,
        from: {
          element: elementFrom,
          position: indexToRemove,
        },
        to: {
          element: 'root',
          position: value.value.length,
        },
      });

      select(droppedData.element.id.value);
    }
  }, [value, select, hideInsertBar]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragHover = useCallback((_: TDraggableElement | undefined, __: TDropMonitor) => {
    const lastElementChild = frameDocumentRef?.lastElementChild;
    if (!lastElementChild) return;

    const targeCoords = lastElementChild.getBoundingClientRect();

    showInsertBar({
      isVisible: true,
      isHorizontal: true,
      left: targeCoords.left,
      width: targeCoords.width,
      height: targeCoords.height,
      top: !lastElementChild ? targeCoords.top : targeCoords.top + targeCoords.height,
    });
  }, [frameDocumentRef?.lastElementChild, showInsertBar]);

  const handleScroll = useCallback((y: number, x: number) => {
    updateSelectBarScroll(y, x);
    updateHoverBarScroll(y, x);
  }, [updateSelectBarScroll, updateHoverBarScroll]);

  const handleClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    select(undefined);
  }, [select]);


  const [{ isDraggingOver, isDraggingOverCurrent }] = useDrop<TDraggableElement>({
    drop: handleDrop,
    hover: handleDragHover,
    id: droppableId.current.id,
    element: { current: frameDocumentRef },
    leave: () => { hideInsertBar(); hover(undefined); },
  }, [handleDrop, handleDragHover, hideInsertBar]);


  return (
    <CustomFrame
      styles={styles}
      resetBody={false}
      draggingHover={isDraggingOver || isDraggingOverCurrent}
    >
      <ContentFrame
        onClick={handleClick}
        onKeyDown={onKeyDown}
        onScroll={handleScroll}
        onRef={setFrameDocumentRef}
      >
        <InsertBar />
        <HoverBarWrapper />
        <SelectBarWrapper />

        {content.map((element) => (
          <Element
            parents={[]}
            element={element}
            key={element.id.value}
          />
        ))}

        {content.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center", margin: 24, padding: 24, backgroundColor: 'lightgray', borderRadius: 8, outline: 'none' }}>
            <span style={{ fontFamily: 'sans-serif', fontSize: 14, opacity: 0.5, userSelect: 'none', outline: 'none' }}>
              Drag and drop here to start
            </span>
          </div>
        )}
      </ContentFrame>
    </CustomFrame>
  );
}
