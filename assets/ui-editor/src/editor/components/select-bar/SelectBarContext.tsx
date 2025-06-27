import { createContext, useEffect, useRef } from "react";
import { type IObservable, observe } from 'react-observing';

import { type TElement, type TParentElement } from '../../types';


export type TGetPosition = () => {
  top: number;
  left: number;
  width: number;
  height: number;
};

interface SelectBarContextProps {
  playgroundSize: IObservable<{ width: number, height: number } | undefined>;
  documentHorizontalScroll: IObservable<number>;
  documentVerticalScroll: IObservable<number>;

  element: IObservable<undefined | TElement>;
  parents: IObservable<undefined | TParentElement[]>;
  getPosition: IObservable<undefined | TGetPosition>;

  id: IObservable<undefined | string>;
  onSelect: (id: string | undefined) => void;
}
export const SelectBarContext = createContext({} as SelectBarContextProps);

interface ISelectBarContextProviderProps {
  children: React.ReactNode;
  id: IObservable<string | undefined>;
  onSelect: (id: string | undefined) => void;
}
export const SelectBarContextProvider = ({ children, id, onSelect }: ISelectBarContextProviderProps) => {
  const store = useRef<SelectBarContextProps>({
    documentHorizontalScroll: observe(0),
    playgroundSize: observe(undefined),
    documentVerticalScroll: observe(0),

    getPosition: observe(undefined),
    parents: observe(undefined),
    element: observe(undefined),
    onSelect,
    id,
  });


  useEffect(() => {
    store.current.id = id;
  }, [id]);

  useEffect(() => {
    store.current.onSelect = onSelect;
  }, [onSelect]);


  return (
    <SelectBarContext.Provider value={store.current}>
      {children}
    </SelectBarContext.Provider>
  );
}
