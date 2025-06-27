import { useSlotContent } from './UseSlotContent';
import { type TElement, type TParentElement } from '../../../types';
import { Element } from '..';


interface IViewProps {
  element: TElement<'slot'>;
  parents: TParentElement[];
}
export const View = ({ element, parents }: IViewProps) => {
  const [content = [], currentContentSlot] = useSlotContent(element, parents);


  return (
    <div style={{ outline: 'none' }}>
      {currentContentSlot && content.map((contentItem) => (
        <Element
          element={contentItem}
          key={contentItem.id.value}
          parents={[...parents, currentContentSlot]}
        />
      ))}
    </div>
  );
};
