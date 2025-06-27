import { useEffect, useMemo } from 'react';
import { type IObservable, selector, useObserverValue } from 'react-observing';

import { type TStyle } from '../../types';


interface ICustomFrameProps {
  resetBody: boolean;
  draggingHover: boolean;
  children: React.ReactNode;
  styles: IObservable<TStyle[]>;
}
export const CustomFrame = ({ children, styles, draggingHover, resetBody }: ICustomFrameProps) => {
  const allStyles = useObserverValue(
    useMemo(() => selector(({ get }) => {
      return get(styles).map(style => ({
        id: get(style.id),
        content: get(style.content)
      }));
    }), [styles])
  );


  const iframeStyles = useMemo(() => {
    return [
      ...allStyles.map(style => style.content),
      `* { outline: none; }`,
      resetBody ? 'body { margin:0!important; }' : '',
      `html${draggingHover ? '' : ':hover'} body .frame-content * {`,
      `  outline: thin solid #80808050;`,
      `}`,
      `[data-hover="true"] *, [data-select="true"] * {`,
      `  outline: none!important;`,
      `}`,
    ].join('\n');
  }, [allStyles, draggingHover, resetBody]);


  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = iframeStyles;

    document.head.append(style);

    return () => {
      style.remove();
    }
  }, [iframeStyles]);


  return children;
};
