import { useContext } from "react"

import { type IInsertBarContextProps, InsertBarContext } from "./InsertBarContext";


export const useInsertBar = (): IInsertBarContextProps => {
  return useContext(InsertBarContext);
}
