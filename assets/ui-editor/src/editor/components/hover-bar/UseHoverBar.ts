import { useCallback, useContext } from "react"
import { set } from 'react-observing';

import { HoverBarContext, type TGetPosition } from "./HoverBarContext";
import { type TElement } from '../../types';


export const useHoverBar = () => {
  const context = useContext(HoverBarContext);


  const handleHover = useCallback((id: string | undefined) => {
    if (context.id.value !== id) context.onHover(id);
  }, [context.id]);

  const handleUpdateHoverBar = useCallback((element: TElement, getPosition: TGetPosition) => {
    set(context.getPosition, () => getPosition);
    set(context.element, element);
  }, [context.getPosition]);

  const handleUpdateScroll = useCallback((y: number, x: number) => {
    set(context.documentHorizontalScroll, x);
    set(context.documentVerticalScroll, y);
  }, [context.documentVerticalScroll, context.documentHorizontalScroll]);

  const handleUpdatePlaygroundSize = useCallback((height: number, width: number) => {
    set(context.playgroundSize, { height, width });
  }, [context.playgroundSize]);


  return {
    hover: handleHover,
    hoveredId: context.id,
    hoveredElement: context.element,

    updateHoverBar: handleUpdateHoverBar,
    updateHoverBarScroll: handleUpdateScroll,
    updateHoverBarPlaygroundSize: handleUpdatePlaygroundSize,

    hoverBarGetPosition: context.getPosition,
    hoverBarPlaygroundSize: context.playgroundSize,
    hoverBarDocumentVerticalScroll: context.documentVerticalScroll,
    hoverBarDocumentHorizontalScroll: context.documentHorizontalScroll,
  };
}
