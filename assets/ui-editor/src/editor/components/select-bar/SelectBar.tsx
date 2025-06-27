import { useRef, memo, useMemo } from "react";


interface SelectBarProps {
  color?: string;
  zIndex?: number;
  height?: number;
  width?: number;
  left?: number;
  top?: number;

  children?: React.ReactNode;
}
export const SelectBar: React.FC<SelectBarProps> = memo(({ children, zIndex = 0, top = -1000, left = -1000, width = 0, height = 0, color = '#4a87ee' }) => {
  const refToTag = useRef<HTMLDivElement>(null);


  const detailsLeft = useMemo(() => {
    if (!refToTag.current) return 0;

    if ((left + refToTag.current.getBoundingClientRect().width) <= refToTag.current.ownerDocument.documentElement.clientWidth) return 0;

    // left - refToTag.current.ownerDocument.documentElement.clientWidth
    const leftAndWith = left + refToTag.current.getBoundingClientRect().width;

    return refToTag.current.ownerDocument.documentElement.clientWidth - leftAndWith;
  }, [left]);


  return (
    <div
      data-select
      style={{
        top,
        left,
        position: 'fixed',
        border: 'thin solid',
        pointerEvents: 'none',

        width,
        height,
        fontSize: 14,
        zIndex: 5 + zIndex,
        borderColor: color,
        fontFamily: 'sans-serif',
      }}
    >
      <span
        ref={refToTag}
        style={{
          zIndex: 5,
          height: 20,
          color: 'white',
          paddingLeft: 8,
          borderRadius: 4,
          paddingRight: 8,
          outline: 'none',
          display: 'flex',
          left: detailsLeft,
          userSelect: 'none',
          position: 'absolute',
          alignItems: 'center',
          pointerEvents: 'none',
          backgroundColor: color,
          top: top - 20 < 0 ? (height + 20) >= 500 ? 0 : height : -20,
        }}
      >
        {children}
      </span>
    </div>
  );
});
