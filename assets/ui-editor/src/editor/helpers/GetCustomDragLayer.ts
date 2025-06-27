
interface IOptions {
  textColor?: string;
  color?: string;
  icon?: string;
}
export const getCustomDragLayer = (text: string, options?: IOptions): HTMLLabelElement => {
  const container = document.createElement('label');

  container.style.padding = '4px';
  container.style.paddingTop = '2px';
  container.style.paddingRight = '8px';
  container.style.paddingBottom = '2px';

  container.style.backgroundColor = options?.color || '#3e8ce4';
  container.style.color = options?.textColor || '#ffffff';
  container.style.alignItems = 'center';
  container.style.borderRadius = '2px';
  container.style.fontWeight = '600';
  container.style.position = 'fixed';
  container.style.fontSize = '11px';
  container.style.display = 'flex';
  container.style.height = '20px';
  container.style.zIndex = '-100';
  container.style.width = 'auto';

  if (options?.icon && options?.icon.includes('data')) {
    const icon = document.createElement('img');

    icon.width = 16;
    icon.alt = text;
    icon.height = 16;
    icon.src = options?.icon;
    icon.style.marginRight = '4px';
    icon.style.filter = 'brightness(2)';

    container.appendChild(icon);
  }

  container.appendChild(new Text(text));


  document.body.appendChild(container);

  return container;
}