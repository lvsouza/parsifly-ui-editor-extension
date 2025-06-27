import { useMemo } from "react";
import { selector, useObserverValue } from "react-observing";

import { useUiEditorContext } from '../../../UiEditorContext';
import { toCamelCase } from './../../../helpers';
import { type TElement } from '../../../types';


export const useElementAttributes = (element: TElement<'html'>) => {
  const { onExpressionToValue } = useUiEditorContext();


  const propsObservable = useMemo(() => {
    return selector({
      get({ get }) {
        const attributes = get(element.attributes);
        if (!attributes) return [{}, {}];

        const props: Record<string, string | number | boolean | undefined | null> = {};
        const specialProps: Record<string, string | number | boolean | undefined | null> = {};

        attributes.forEach(attribute => {
          const name = get(attribute.name);

          if (name === undefined) return;
          if (name === 'hidden') return;
          if (name === 'style') return;


          const value = onExpressionToValue(get(attribute.value), name, 'attribute', element);

          const attributeAsCamelCase = toCamelCase(name);
          switch (attributeAsCamelCase) {
            // Especial props
            case 'options':
              specialProps.options = value;
              break;

            // Common props
            case 'className':
              props.className = value;
              break;
            case 'class':
              props.className = value;
              break;

            default:
              if (name.startsWith('data-')) {
                props[name] = value;
                return;
              } else {
                props[attributeAsCamelCase] = value;
              }
              break;
          }
        });

        return [props, specialProps];
      },
    });
  }, [element, onExpressionToValue]);


  return useObserverValue(propsObservable);
}
