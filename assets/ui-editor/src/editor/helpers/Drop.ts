import { type TDropMonitor } from 'react-use-drag-and-drop';

import { type TElement, type TParentElement } from '../types';


export const getCanDrop = (monitor: TDropMonitor, element: TElement<"html" | "slot" | "component" | "text" | "slot-content">, parents: TParentElement[], elementRef: React.RefObject<HTMLElement>, droppableId: string) => {
  if (!elementRef.current) return false;

  /* Verify if the current drop action belongs to other droppable area  */
  if (monitor.droppableId !== droppableId) return false;

  const isSomeId = monitor.draggingId === element.id.value;
  if (isSomeId) return false;

  const willIgnore = parents.some(parentItem => monitor.draggingId === parentItem.id.value);
  if (willIgnore) return false;

  return true;
};

export const getDropPosition = (monitor: TDropMonitor, element: TElement<'component' | 'html' | 'slot' | "text" | 'slot-content'>, elementRef: React.RefObject<HTMLElement>) => {
  if (!elementRef.current) return null;

  if (element.type.value === 'slot-content' && Array.isArray((element as TElement<'slot-content'>).children.value)) {
    return { isOverCurrentStart: false, isOverCurrentEnd: false, isOverEnd: false, isOverStart: false };
  }

  const allowContent = ['component', 'slot', 'text'].includes(element.type.value) ? false : Array.isArray((element as TElement<'html'>).children.value);

  const targetDomRect = elementRef.current.getBoundingClientRect();

  const dragBreakSize = allowContent ? 5 : targetDomRect.height / 2;
  const draggedLeft = monitor.x - targetDomRect.x;
  const draggedTop = monitor.y - targetDomRect.y;

  const hoverTop = (draggedTop >= 0) && (draggedTop <= dragBreakSize);
  const hoverBottom = (draggedTop >= (targetDomRect.height - dragBreakSize) && draggedTop <= targetDomRect.height);
  const verticalCenter = (draggedTop >= dragBreakSize) && (draggedTop <= (targetDomRect.height - dragBreakSize));

  const hoverLeft = (draggedLeft >= 0) && (draggedLeft <= dragBreakSize);
  const hoverRight = (draggedLeft >= (targetDomRect.width - dragBreakSize) && draggedLeft <= targetDomRect.width);
  const horizontalCenter = (draggedLeft >= dragBreakSize) && (draggedLeft <= (targetDomRect.width - dragBreakSize));


  let isOverCurrentStart = false;
  let isOverCurrentEnd = false;
  let isOverEnd = false;
  let isOverStart = false;

  if (allowContent) {
    const isNotCurrent = hoverBottom || hoverRight || hoverTop || hoverLeft;

    isOverCurrentStart = horizontalCenter && verticalCenter && !isNotCurrent;
    isOverCurrentEnd = horizontalCenter && verticalCenter && !isNotCurrent;
    isOverEnd = hoverBottom || hoverRight;
    isOverStart = hoverTop || hoverLeft;
  } else {
    isOverEnd = (hoverBottom || hoverRight) && !hoverTop;
    isOverStart = (hoverTop || hoverLeft) && !hoverBottom;
  }

  return { isOverCurrentStart, isOverCurrentEnd, isOverEnd, isOverStart };
};

export const getInsertBarPosition = (monitor: TDropMonitor, element: TElement<'component' | 'html' | 'slot' | "text" | 'slot-content'>, elementRef: React.RefObject<HTMLElement>) => {
  if (!elementRef.current) return null;

  const targetDomRect = elementRef.current.getBoundingClientRect();

  if (element.type.value === 'slot-content' && Array.isArray((element as TElement<'slot-content'>).children.value)) {
    return {
      isHorizontal: true,
      left: targetDomRect.left,
      width: targetDomRect.width,
      height: targetDomRect.height,
      top: targetDomRect.top + (targetDomRect.height / 2),
    };
  }

  const allowContent = ['component', 'slot', 'text'].includes(element.type.value) ? false : Array.isArray((element as TElement<'html'>).children.value);

  const dragBreakSize = allowContent ? 5 : targetDomRect.height / 2;
  const draggedLeft = monitor.x - targetDomRect.x;
  const draggedTop = monitor.y - targetDomRect.y;

  const hoverBottom = (draggedTop >= (targetDomRect.height - dragBreakSize) && draggedTop <= targetDomRect.height);
  const verticalCenter = (draggedTop >= dragBreakSize) && (draggedTop <= (targetDomRect.height - dragBreakSize));

  const hoverLeft = (draggedLeft >= 0) && (draggedLeft <= dragBreakSize);
  const hoverRight = (draggedLeft >= (targetDomRect.width - dragBreakSize) && draggedLeft <= targetDomRect.width);
  const horizontalCenter = (draggedLeft >= dragBreakSize) && (draggedLeft <= (targetDomRect.width - dragBreakSize));

  let isHorizontal = true;
  let newTop = targetDomRect.top;
  let newLeft = targetDomRect.left;
  const newWidth = targetDomRect.width;
  const newHeight = targetDomRect.height;

  if (hoverBottom && (hoverLeft || hoverRight || horizontalCenter)) {
    newTop = targetDomRect.top + targetDomRect.height;
  } else if (verticalCenter && hoverLeft) {
    isHorizontal = false;
  } else if (verticalCenter && hoverRight) {
    newLeft = targetDomRect.left + targetDomRect.width;
    isHorizontal = false;
  } else if (horizontalCenter && verticalCenter) {
    newTop = targetDomRect.top + (allowContent ? (targetDomRect.height / 2) : targetDomRect.height);
  }

  return {
    top: newTop,
    isHorizontal,
    left: newLeft,
    width: newWidth,
    height: newHeight
  };
};
