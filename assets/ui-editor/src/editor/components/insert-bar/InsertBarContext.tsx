import { createContext, useCallback, useMemo, useRef } from "react";
import { type IObservable, observe, set } from 'react-observing';


interface IEventData {
  top: number;
  left: number;
  width: number;
  height: number;
  isVisible: boolean;
  isHorizontal?: boolean;
}

export interface IInsertBarContextProps {
  hideInsertBar: () => void;
  showInsertBar: (data: IEventData) => void;
  observables: {
    observableTop: IObservable<number>;
    observableLeft: IObservable<number>;
    observableWidth: IObservable<number>;
    observableHeight: IObservable<number>;
    observableIsVisible: IObservable<boolean>;
    observableIsHorizontal: IObservable<boolean | undefined>;
  };
}
export const InsertBarContext = createContext({} as IInsertBarContextProps);

interface IInsertBarContextProviderProps {
  children: React.ReactNode;
}
export const InsertBarContextProvider = ({ children }: IInsertBarContextProviderProps) => {
  const isHorizontalObservable = useRef(observe(false));
  const isVisibleObservable = useRef(observe(false));
  const heightObservable = useRef(observe(0));
  const widthObservable = useRef(observe(0));
  const leftObservable = useRef(observe(0));
  const topObservable = useRef(observe(0));

  const observables = useMemo(() => {
    return {
      observableIsHorizontal: isHorizontalObservable.current,
      observableIsVisible: isVisibleObservable.current,
      observableHeight: heightObservable.current,
      observableWidth: widthObservable.current,
      observableLeft: leftObservable.current,
      observableTop: topObservable.current,
    };
  }, []);


  const handleInsert = useCallback((data: IEventData) => {
    set(topObservable.current, old => old !== data.top ? data.top : old);
    set(leftObservable.current, old => old !== data.left ? data.left : old);
    set(widthObservable.current, old => old !== data.width ? data.width : old);
    set(heightObservable.current, old => old !== data.height ? data.height : old);
    set(isVisibleObservable.current, old => old !== data.isVisible ? data.isVisible : old);
    set(isHorizontalObservable.current, old => old !== !!data.isHorizontal ? !!data.isHorizontal : old);
  }, []);

  const handleHide = useCallback(() => {
    handleInsert({
      width: 0,
      height: 0,
      top: -100,
      left: -100,
      isVisible: false,
    });
  }, [handleInsert]);


  return (
    <InsertBarContext.Provider value={{ showInsertBar: handleInsert, hideInsertBar: handleHide, observables }}>
      {children}
    </InsertBarContext.Provider>
  );
}
