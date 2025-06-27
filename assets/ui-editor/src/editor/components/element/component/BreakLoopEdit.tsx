import { type MouseEvent, useRef } from 'react';
import { useObserverValue } from 'react-observing';

import { useMatchEffect } from '../UseMatchEffect';
import { useSelectBar } from '../../select-bar';
import { useHoverBar } from '../../hover-bar';
import { type TElement } from '../../../types';


interface IBreakLoopEditProps {
  element: TElement<'component'>;

  onMouseLeave: (event: MouseEvent) => void;
  onSelect: (event: MouseEvent, element: TElement<'component'>) => void;
  onMouseOver: (event: MouseEvent, element: TElement<'component'>, htmlElement: HTMLElement | null) => void;

  onHoverBar: (element: TElement<'component'>, htmlElement: HTMLElement | null) => void;
  onSelectBar: (element: TElement<'component'>, htmlElement: HTMLElement | null) => void;
}
export const BreakLoopEdit = ({ element, onHoverBar, onSelectBar, onMouseLeave, onMouseOver, onSelect }: IBreakLoopEditProps) => {
  const elementRef = useRef<HTMLDivElement>(null);


  const { selectedId } = useSelectBar();
  const { hoveredId } = useHoverBar();


  const name = useObserverValue(element.name);


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


  return (
    <div
      ref={elementRef}
      onMouseLeave={onMouseLeave}
      onClick={e => onSelect(e, element)}
      onMouseOver={e => onMouseOver(e, element, elementRef.current)}
      style={{
        outline: 'none',
        cursor: 'default',
        userSelect: 'none',
        pointerEvents: 'all',
        fontFamily: 'sans-serif',
        border: '2px solid orange',
      }}
    >
      This component "<b style={{ fontWeight: 'bold', outline: 'none', pointerEvents: 'none' }}>{name}</b>" introduces a infinite loop.
    </div>
  );
};
