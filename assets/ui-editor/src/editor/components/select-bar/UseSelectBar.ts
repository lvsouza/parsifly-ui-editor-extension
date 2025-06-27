import { useCallback, useContext } from "react"
import { set } from 'react-observing';

import { SelectBarContext, type TGetPosition } from "./SelectBarContext";
import { type TElement, type TParentElement } from '../../types';


export const useSelectBar = () => {
  const context = useContext(SelectBarContext);


  const handleSelect = useCallback((id: string | undefined) => {
    context.onSelect(id);
  }, [context.id]);

  const handleUpdateSelectBar = useCallback((element: TElement | undefined, parents?: TParentElement[], getPosition?: TGetPosition) => {
    set(context.getPosition, () => getPosition);
    set(context.parents, parents);
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
    select: handleSelect,
    selectedId: context.id,
    selectedElement: context.element,
    selectedElementParents: context.parents,

    updateSelectBar: handleUpdateSelectBar,
    updateSelectBarScroll: handleUpdateScroll,
    updateSelectBarPlaygroundSize: handleUpdatePlaygroundSize,

    selectBarGetPosition: context.getPosition,
    selectBarPlaygroundSize: context.playgroundSize,
    selectBarDocumentVerticalScroll: context.documentVerticalScroll,
    selectBarDocumentHorizontalScroll: context.documentHorizontalScroll,
  };
}
