import { useEffect } from 'react';
import { useFrame } from 'react-frame-component';


interface IContentFrameProps {
  children: React.ReactNode;
  onRef: (document: Document) => void;
  onClick: (event: MouseEvent) => void;
  onScroll: (y: number, x: number) => void;
  onKeyDown: (event: KeyboardEvent) => void;
}
export const ContentFrame: React.FC<IContentFrameProps> = ({ children, onScroll, onRef, onKeyDown, onClick }) => {
  const { document } = useFrame();


  useEffect(() => {
    if (!document) return;

    onRef(document);
  }, [onRef, document]);

  useEffect(() => {
    if (!document) return;

    document.onclick = onClick;
    document.onkeydown = onKeyDown;
    document.onscroll = (e: any) => onScroll(e.target.documentElement.scrollTop, e.target.documentElement.scrollLeft);
  }, [document, onScroll, onKeyDown, onClick]);


  return children;
};
