/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { acquireStudioApi } from '@parsifly/extension-basics/web-view';
import { observe, set } from 'react-observing';

import { UIEditor, type TComponent, type TDropFunctionProps, type TElement, type TStyle, type TValueParseFunction } from './editor';
import { uuid } from './editor/helpers';


const studioApi = acquireStudioApi();

const initialContent = {
  styles: observe<TStyle[]>([
    { id: observe(uuid()), content: observe('button { padding:8px; padding-left:16px;padding-right:16px; border:none; background-color:green; border-radius:4px; color:white; }') },
    { id: observe(uuid()), content: observe('button:disabled { opacity: 0.5 }') }
  ]),
  components: observe<TComponent[]>([
    { // Custom input
      id: observe('simple-component'),
      content: observe<TElement[]>([
        {
          id: observe(uuid()),
          type: observe('html'),
          tag: observe('input'),
          name: observe('input'),
          customData: { teste: 1 },
          children: observe(undefined),
          attributes: observe([
            { name: observe('placeholder'), value: observe('Type a email here...') },
          ]),
          style: observe([
            { name: observe('padding'), value: observe(8) },
            { name: observe('padding-left'), value: observe(16) },
            { name: observe('padding-right'), value: observe(16) },
            { name: observe('border'), value: observe('thin solid gray') },
            { name: observe('border-radius'), value: observe(50) },
          ]),
        },
      ]),
    },
    { // Component with a slot
      id: observe('component-with-slot'),
      content: observe<TElement[]>([
        {
          id: observe(uuid()),
          type: observe('html'),
          tag: observe('div'),
          name: observe('div'),
          style: observe([
            { name: observe('padding'), value: observe(16) },
          ]),
          attributes: observe([
            { name: observe('hidden'), value: observe(false) },
          ]),
          children: observe<TElement[]>([
            {
              id: observe(uuid()),
              tag: observe('p'),
              name: observe('p'),
              style: observe([]),
              type: observe('html'),
              attributes: observe([]),
              customData: { teste: 4 },
              children: observe([
                {
                  id: observe(uuid()),
                  type: observe('text'),
                  name: observe('text'),
                  customData: { teste: 88 },
                  text: observe('"Slot below:"'),
                }
              ]),
            },
            {
              id: observe('slot-component-with-slot'),
              type: observe('slot'),
              name: observe('Slot1'),
              componentId: observe('component-with-slot'),
            },
          ]),
        },
      ]),
    },
    { // Component with component with slot
      id: observe('component-with-component-with-slot'),
      content: observe<TElement[]>([
        {
          id: observe(uuid()),
          type: observe('html'),
          tag: observe('div'),
          name: observe('div'),
          style: observe([
            { name: observe('padding'), value: observe(16) },
          ]),
          attributes: observe([
            { name: observe('hidden'), value: observe(false) },
          ]),
          children: observe<TElement[]>([
            {
              id: observe(uuid()),
              tag: observe('p'),
              name: observe('p'),
              style: observe([]),
              type: observe('html'),
              customData: { teste: 4 },
              attributes: observe([]),
              children: observe([
                {
                  id: observe(uuid()),
                  type: observe('text'),
                  name: observe('text'),
                  customData: { teste: 88 },
                  text: observe('"Component with slot below:"'),
                }
              ]),
            },
            {
              id: observe(uuid()),
              slots: observe([]),
              type: observe('component'),
              name: observe('Component with slot'),
              referenceComponentId: observe('component-with-slot'),
            },
          ]),
        },
      ]),
    },
    { // Component with component with slot with a child
      id: observe('component-with-component-with-slot-with-child'),
      content: observe<TElement[]>([
        {
          id: observe(uuid()),
          type: observe('html'),
          tag: observe('div'),
          name: observe('div'),
          style: observe([
            { name: observe('padding'), value: observe(16) },
          ]),
          attributes: observe([
            { name: observe('hidden'), value: observe(false) },
          ]),
          children: observe<TElement[]>([
            {
              id: observe(uuid()),
              tag: observe('p'),
              name: observe('p'),
              style: observe([]),
              type: observe('html'),
              attributes: observe([]),
              customData: { teste: 4 },
              children: observe([
                {
                  id: observe(uuid()),
                  type: observe('text'),
                  name: observe('text'),
                  customData: { teste: 88 },
                  text: observe('"Component with slot with children below:"'),
                }
              ]),
            },
            {
              id: observe(uuid()),
              type: observe('component'),
              name: observe('Component with slot'),
              referenceComponentId: observe('component-with-slot'),
              slots: observe<TElement<'slot-content'>[]>([
                {
                  id: observe(uuid()),
                  type: observe('slot-content'),
                  referenceSlotId: observe('slot-component-with-slot'),
                  children: observe([
                    {
                      id: observe(uuid()),
                      tag: observe('p'),
                      name: observe('p'),
                      style: observe([]),
                      type: observe('html'),
                      attributes: observe([]),
                      customData: { teste: 4 },
                      children: observe([
                        {
                          id: observe(uuid()),
                          type: observe('text'),
                          name: observe('text'),
                          customData: { teste: 88 },
                          text: observe('"Child of a component with slot in a component:"'),
                        }
                      ]),
                    },
                  ]),
                }
              ]),
            },
          ]),
        },
      ]),
    },
    { // Loop 1 - Component inside it self
      id: observe('component-with-it-self'),
      content: observe<TElement[]>([
        {
          id: observe(uuid()),
          type: observe('html'),
          tag: observe('div'),
          name: observe('div'),
          style: observe([
            { name: observe('padding'), value: observe(16) },
          ]),
          attributes: observe([
            { name: observe('hidden'), value: observe(false) },
          ]),
          children: observe<TElement[]>([
            {
              id: observe(uuid()),
              tag: observe('p'),
              name: observe('p'),
              style: observe([]),
              type: observe('html'),
              attributes: observe([]),
              children: observe([
                {
                  id: observe(uuid()),
                  type: observe('text'),
                  name: observe('text'),
                  customData: { teste: 88 },
                  text: observe('"It self below:"'),
                }
              ]),
            },
            {
              id: observe(uuid()),
              slots: observe([]),
              type: observe('component'),
              name: observe('Component with it self'),
              referenceComponentId: observe('component-with-it-self'),
            },
          ]),
        },
      ]),
    },
    { // Loop 2 - Component with component inside with this inside
      id: observe('component-with-component-inside-with-this-inside'),
      content: observe<TElement[]>([
        {
          id: observe(uuid()),
          type: observe('html'),
          tag: observe('div'),
          name: observe('div'),
          style: observe([
            { name: observe('padding'), value: observe(16) },
          ]),
          attributes: observe([
            { name: observe('hidden'), value: observe(false) },
          ]),
          children: observe<TElement[]>([
            {
              id: observe(uuid()),
              tag: observe('p'),
              name: observe('p'),
              style: observe([]),
              type: observe('html'),
              attributes: observe([]),
              children: observe([
                {
                  id: observe(uuid()),
                  type: observe('text'),
                  name: observe('text'),
                  customData: { teste: 88 },
                  text: observe('"1 - Other with it self below:"'),
                }
              ]),
            },
            {
              id: observe(uuid()),
              slots: observe([]),
              type: observe('component'),
              name: observe('Component with component with it self'),
              referenceComponentId: observe('component-with-component-inside-with-this-inside-2'),
            },
          ]),
        },
      ]),
    },
    { // Loop 2 - Component with component inside with this inside 2
      id: observe('component-with-component-inside-with-this-inside-2'),
      content: observe<TElement[]>([
        {
          id: observe(uuid()),
          type: observe('html'),
          tag: observe('div'),
          name: observe('div'),
          style: observe([
            { name: observe('padding'), value: observe(16) },
          ]),
          attributes: observe([
            { name: observe('hidden'), value: observe(false) },
          ]),
          children: observe<TElement[]>([
            {
              id: observe(uuid()),
              tag: observe('p'),
              name: observe('p'),
              style: observe([]),
              type: observe('html'),
              attributes: observe([]),
              children: observe([
                {
                  id: observe(uuid()),
                  type: observe('text'),
                  name: observe('text'),
                  customData: { teste: 88 },
                  text: observe('"2 - Other with it self below:"'),
                }
              ]),
            },
            {
              id: observe(uuid()),
              slots: observe([]),
              type: observe('component'),
              name: observe('Component with component with it self'),
              referenceComponentId: observe('component-with-component-inside-with-this-inside'),
            },
          ]),
        },
      ]),
    },
  ]),
  value: observe<TElement[]>([
    {
      id: observe(uuid()),
      type: observe('html'),
      tag: observe('button'),
      name: observe('button'),
      customData: { teste: 1 },
      style: observe(undefined),
      attributes: observe([
        { name: observe('hidden'), value: observe(false) },
        { name: observe('title'), value: observe('"Some title in a button"') },
      ]),
      children: observe([
        {
          id: observe(uuid()),
          type: observe('text'),
          name: observe('text'),
          customData: { teste: 88 },
          text: observe('"Button"'),
        }
      ]),
    },
    /* {
      id: observe(uuid()),
      type: observe('slot'),
      customData: { teste: 4 },
      name: observe('slot'),
      componentId: observe('slot'),
    },
    {
      id: observe(uuid()),
      type: observe('html'),
      tag: observe('button'),
      customData: { teste: 3 },
      name: observe('button'),
      children: observe(undefined),
      attributes: observe([
        { name: observe('text'), value: observe('Clique me!') },
        { name: observe('disabled'), value: observe(true) },
      ]),
      style: observe([
        { name: observe('backgroundColor'), value: observe('transparent') },
        { name: observe('color'), value: observe('black') },
        { name: observe('border'), value: observe('thin solid') },
      ]),
    },
    {
      id: observe(uuid()),
      tag: observe('div'),
      type: observe('html'),
      children: observe([]),
      customData: { teste: 4 },
      attributes: observe([]),
      name: observe('div'),
      style: observe([]),
    },
    {
      id: observe(uuid()),
      tag: observe('div'),
      type: observe('html'),
      customData: { teste: 4 },
      attributes: observe([]),
      name: observe('div'),
      style: observe([]),
      children: observe([
        {
          id: observe(uuid()),
          style: observe([]),
          name: observe('input'),
          tag: observe('input'),
          type: observe('html'),
          attributes: observe([]),
          customData: { teste: 4 },
          children: observe(undefined),
        },
      ]),
    },
    {
      id: observe(uuid()),
      type: observe('component'),
      name: observe('CustomInput'),
      referenceId: observe('custom-input'),
    },
    {
      id: observe(uuid()),
      type: observe('component'),
      name: observe('CustomSendEmail'),
      referenceId: observe('custom-send-email'),
    } */
    /* {
      id: observe(uuid()),
      type: observe('component'),
      name: observe('slot-level-1'),
      referenceComponentId: observe('slot-level-1'),
      slots: observe<TElement<'slot-content'>[]>([
        {
          id: observe(uuid()),
          type: observe('slot-content'),
          referenceSlotId: observe('slot-level-1-slot'),
          children: observe([
            {
              id: observe(uuid()),
              type: observe('component'),
              name: observe('slot-level-2'),
              referenceComponentId: observe('slot-level-2'),
              slots: observe<TElement<'slot-content'>[]>([
                {
                  id: observe(uuid()),
                  type: observe('slot-content'),
                  referenceSlotId: observe('slot-level-2-slot'),
                  children: observe([
                    {
                      id: observe(uuid()),
                      type: observe('html'),
                      tag: observe('button'),
                      customData: { teste: 1 },
                      style: observe(undefined),
                      name: observe('button'),
                      attributes: observe([
                        { name: observe('hidden'), value: observe(false) },
                      ]),
                      children: observe([
                        {
                          tag: observe('a'),
                          id: observe(uuid()),
                          name: observe('a'),
                          type: observe('html'),
                          customData: { teste: 2 },
                          style: observe(undefined),
                          children: observe(undefined),
                          attributes: observe([
                            { name: observe('text'), value: observe('button') },
                          ]),
                        },
                      ]),
                    },
                  ]),
                }
              ]),
            },
          ]),
        }
      ]),
    }, */
  ]),
};

export function App() {
  const [content, setContent] = useState<typeof initialContent>();


  useEffect(() => {
    const unsubscribe = studioApi.subscribeToMessage((value, id) => {
      console.log('Extension view:', value, id);

      setContent(initialContent);
    });

    return () => unsubscribe();
  }, []);


  const hoveredId = useMemo(() => observe<string | undefined>(undefined), []);
  const selectedId = useMemo(() => observe<string | undefined>(undefined), []);


  const handleGetDropElement = useCallback((element: string | TElement): TElement<"html" | "component" | "slot" | "text"> => {
    if (typeof element === 'object') return element;

    if (element === 'text') {
      return {
        id: observe(uuid()),
        type: observe('text'),
        name: observe('text'),
        customData: { teste: 15 },
        text: observe('Text here'),
      };
    } else if (element === 'button') {
      return {
        id: observe(uuid()),
        type: observe('html'),
        tag: observe('button'),
        customData: { teste: 3 },
        name: observe('button'),
        children: observe([
          {
            id: observe(uuid()),
            type: observe('text'),
            name: observe('Button text'),
            customData: { teste: 56 },
            text: observe('Button text'),
          }
        ]),
        attributes: observe([
          { name: observe('disabled'), value: observe(false) },
        ]),
        style: observe([
          { name: observe('backgroundColor'), value: observe('transparent') },
          { name: observe('color'), value: observe('black') },
          { name: observe('border'), value: observe('thin solid') },
        ]),
      };
    } else if (element === 'div') {
      return {
        id: observe(uuid()),
        tag: observe('div'),
        type: observe('html'),
        children: observe([]),
        customData: { teste: 4 },
        attributes: observe([]),
        name: observe('div'),
        style: observe([]),
      };
    } else if (element === 'p') {
      return {
        id: observe(uuid()),
        tag: observe('p'),
        name: observe('p'),
        style: observe([]),
        type: observe('html'),
        attributes: observe([]),
        customData: { teste: 4 },
        children: observe([
          {
            id: observe(uuid()),
            type: observe('text'),
            name: observe('text'),
            customData: { teste: 56 },
            text: observe('Paragraph'),
          }
        ]),
      };
    } else if (element === 'simple-component') {
      return {
        id: observe(uuid()),
        slots: observe([]),
        type: observe('component'),
        name: observe('CustomInput'),
        referenceComponentId: observe('simple-component'),
      };
    } else if (element === 'component-with-slot') {
      return {
        id: observe(uuid()),
        slots: observe([]),
        type: observe('component'),
        name: observe('component-with-slot'),
        referenceComponentId: observe('component-with-slot'),
      };
    } else if (element === 'component-with-component-with-slot') {
      return {
        id: observe(uuid()),
        slots: observe([]),
        type: observe('component'),
        name: observe('component-with-component-with-slot'),
        referenceComponentId: observe('component-with-component-with-slot'),
      };
    } else if (element === 'component-with-component-with-slot-with-child') {
      return {
        id: observe(uuid()),
        slots: observe([]),
        type: observe('component'),
        name: observe('component-with-component-with-slot-with-child'),
        referenceComponentId: observe('component-with-component-with-slot-with-child'),
      };
    } else if (element === 'component-with-it-self') {
      return {
        id: observe(uuid()),
        slots: observe([]),
        type: observe('component'),
        name: observe('component-with-it-self'),
        referenceComponentId: observe('component-with-it-self'),
      };
    } else if (element === 'component-with-component-inside-with-this-inside') {
      return {
        id: observe(uuid()),
        slots: observe([]),
        type: observe('component'),
        name: observe('component-with-component-inside-with-this-inside'),
        referenceComponentId: observe('component-with-component-inside-with-this-inside'),
      };
    }

    throw new Error("Error on create the new element");
  }, []);

  const handleDrop = useCallback(({ element, from, to }: TDropFunctionProps) => {
    //console.log(element, from, to);

    if (!content) return;

    if (from.element && typeof element !== 'string') {
      set(from.element === 'root' ? content.value : from.element.children, oldContent => {
        if (!oldContent) return oldContent;
        return [...oldContent.filter(contentItem => contentItem.id.value !== element.id.value)];
      });
    }

    // É preciso calcular o position antes porque pode haver conflitos com o remover
    const droppedElement = handleGetDropElement(element);

    if (to.element === 'root') {
      const position = (from.element === to.element) && (from.position < to.position) ? to.position - 1 : to.position;

      set(content.value, oldContent => {
        oldContent.splice(position, 0, droppedElement);
        return [...oldContent];
      });
    } else {
      const position = (from.element !== 'root' && from.element?.id.value === to.element.id.value) && (from.position < to.position)
        ? to.position - 1
        : to.position;

      set(to.element.children, oldContent => {
        if (!oldContent) return oldContent;

        oldContent.splice(position, 0, droppedElement);

        return [...oldContent];
      });
    }

    set(selectedId, droppedElement.id.value);
  }, [content, handleGetDropElement, selectedId]);

  const handleRemove = useCallback((element: TElement) => {
    console.log('remove', element);
  }, []);

  const handleAddSlot = useCallback((element: TElement, referenceComponent: TElement<'component'>) => {
    set(referenceComponent.slots, old => {
      if (old?.some(slot => slot.referenceSlotId.value === element.id.value)) return old;

      return [
        ...(old || []),
        {
          id: observe(uuid()),
          children: observe([]),
          referenceSlotId: observe(element.id.value),
          type: observe<'slot-content'>('slot-content'),
        },
      ];
    });
  }, []);


  const handleExpressionToValue: TValueParseFunction = useCallback((value, /* ownerName, type, element */) => {
    try {
      return eval(String(value));
    } catch (error) {
      return value;
    }
  }, []);

  const handleValueToExpression: TValueParseFunction = useCallback((value, /* ownerName, type, element */) => {
    return `"${value}"`;
  }, []);


  if (!content) return null;

  return (
    <UIEditor
      value={content.value}
      styles={content.styles}
      components={content.components}
      onKeyDown={(...rest) => console.log('end', ...rest)}

      hoveredId={hoveredId}
      selectedId={selectedId}
      onHover={id => set(hoveredId, id)}
      onSelect={id => set(selectedId, id)}

      onDrop={handleDrop}
      onAddSlotContent={handleAddSlot}
      onDragEnd={(...rest) => console.log('end', ...rest)}
      onDragStart={(...rest) => console.log('start', ...rest)}

      onRemove={handleRemove}
      onDuplicate={(...rest) => console.log('duplicate', ...rest)}

      onExpressionToValue={handleExpressionToValue}
      onValueToExpression={handleValueToExpression}
    />
  );
}
