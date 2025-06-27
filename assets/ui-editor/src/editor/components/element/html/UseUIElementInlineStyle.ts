import { useMemo } from 'react'
import { selector, useObserverValue } from 'react-observing';

import { useUiEditorContext } from '../../../UiEditorContext';
import { toCamelCase } from '../../../helpers';
import { type TElement } from '../../../types';


export const useUIElementInlineStyle = (element: TElement<'html'>) => {
  const { onExpressionToValue } = useUiEditorContext();

  const stylesObservable = useMemo(() => {
    return selector(({ get }) => {
      const style = get(element.style);
      if (!style) return {};


      const result: Record<string, string | number | boolean> = {};

      style.forEach((styleItem) => {
        const name = get(styleItem.name);
        const value = get(styleItem.value);

        if (!name) return;

        result[toCamelCase(name)] = onExpressionToValue(value, name, 'style', element);
      });

      return result;
    });
  }, [element, onExpressionToValue, element]);


  return useObserverValue(stylesObservable);
}
