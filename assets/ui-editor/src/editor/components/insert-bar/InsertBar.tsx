import { useMemo } from "react";
import { useObserver } from 'react-observing';

import { useInsertBar } from './UseInsertBar';


interface IInsertBarProps {
  color?: string;
}
export const InsertBar: React.FC<IInsertBarProps> = ({ color = '#3e8ce4' }) => {
  const { observableHeight, observableIsHorizontal, observableIsVisible, observableLeft, observableTop, observableWidth } = useInsertBar().observables;

  const [top] = useObserver(observableTop);
  const [left] = useObserver(observableLeft);
  const [width] = useObserver(observableWidth);
  const [height] = useObserver(observableHeight);
  const [isVisible] = useObserver(observableIsVisible);
  const [isHorizontal] = useObserver(observableIsHorizontal);


  const coords = useMemo(() => {
    return {
      width: !isHorizontal ? 4 : width,
      height: isHorizontal ? 4 : height,
      top: top - (isHorizontal ? 2 : 0),
      left: left - (!isHorizontal ? 2 : 0),
    }
  }, [height, isHorizontal, left, top, width]);

  if (!isVisible) return null;

  return (
    <div
      className="animate-pulse"
      style={{
        zIndex: 10,
        borderRadius: 5,
        top: coords.top,
        position: 'fixed',
        left: coords.left,
        width: coords.width,
        pointerEvents: 'none',
        height: coords.height,
        backgroundColor: color,
      }}
    />
  );
}
