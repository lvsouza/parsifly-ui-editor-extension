import { memo, useMemo } from "react";
import { useObserverValue, useSelectorValue } from "react-observing";

import { useSelectBar } from '../select-bar';
import { useHoverBar } from './UseHoverBar';
import { HoverBar } from "./HoverBar";


export const HoverBarWrapper: React.FC = memo(() => {
  const { selectedId: selectedIdObservable } = useSelectBar();
  const {
    hoveredId: hoveredIdObservable,
    hoveredElement: hoveredElementObservable,
    hoverBarGetPosition: hoverBarGetPositionObserver,
    hoverBarDocumentVerticalScroll: documentVerticalScrollObserver,
    hoverBarDocumentHorizontalScroll: documentHorizontalScrollObserver,
  } = useHoverBar();


  const documentHorizontalScroll = useObserverValue(documentHorizontalScrollObserver);
  const documentVerticalScroll = useObserverValue(documentVerticalScrollObserver);
  const getPosition = useObserverValue(hoverBarGetPositionObserver);
  const hoveredElement = useObserverValue(hoveredElementObservable);
  const selectedId = useObserverValue(selectedIdObservable);
  const hoveredId = useObserverValue(hoveredIdObservable);
  const name = useSelectorValue(({ get }) => {
    if (!hoveredElement) return '';
    return get(hoveredElement.name);
  }, [hoveredElement]);


  const { width, height, top, left } = useMemo(() => {
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
    }
  }, [documentHorizontalScroll, documentVerticalScroll, getPosition]);


  if (!hoveredId || hoveredId === selectedId || (width === 0 && height === 0 && left === 0 && top === 0)) return null;

  return (
    <HoverBar
      zIndex={1}
      top={top - 1}
      width={width}
      left={left - 1}
      height={height}
      color="#ed8b5f"
    >
      <div style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all' }}>
        {name}
      </div>
    </HoverBar>
  );
});
