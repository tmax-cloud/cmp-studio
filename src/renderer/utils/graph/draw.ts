import { NodeKind } from '@renderer/types/graph';
import DefaultIcon from '../../../../assets/images/graph/graph-default-type-icon.png';
import ModuleIcon from '../../../../assets/images/graph/graph-module-type-icon.png';
import NoImageIcon from '../../../../assets/images/graph/graph-no-type-icon.png';
import ResourceIcon from '../../../../assets/images/graph/graph-resource-type-icon.png';

export const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  lineWidth: number,
  strokeColor: string,
  fillColor: string,
  opacity: number
) => {
  const r = x + w;
  const b = y + h;
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.moveTo(x + radius, y);
  ctx.lineTo(r - radius, y);
  ctx.quadraticCurveTo(r, y, r, y + radius);
  ctx.lineTo(r, y + h - radius);
  ctx.quadraticCurveTo(r, b, r - radius, b);
  ctx.lineTo(x + radius, b);
  ctx.quadraticCurveTo(x, b, x, b - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.stroke();
  ctx.fillStyle = fillColor;
  ctx.fill();
};

export const fitText = (
  ctx: CanvasRenderingContext2D,
  str: string,
  maxWidth: number
) => {
  let { width } = ctx.measureText(str);
  const ellipsis = '…';
  const ellipsisWidth = ctx.measureText(ellipsis).width;
  if (width <= maxWidth || width <= ellipsisWidth) {
    return str;
  } else {
    let newStr = str;
    let len = str.length;
    while (width >= maxWidth - ellipsisWidth && len-- > 0) {
      newStr = newStr.substring(0, len);
      width = ctx.measureText(newStr).width;
    }
    return newStr + ellipsis;
  }
};

export const draw2Texts = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  typeStr: string,
  nameStr: string
) => {
  const fontSize = 8;
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  const fittingTypeText = fitText(ctx, typeStr, w - 2);
  const fittingNameText = fitText(ctx, nameStr, w - 2);
  ctx.fillText(fittingTypeText, x + w / 2, y + h - 6 - fontSize);
  ctx.fillText(fittingNameText, x + w / 2, y + h - 6);
};

export const drawImage = (
  ctx: CanvasRenderingContext2D,
  image: string,
  x: number,
  y: number,
  size: number
) => {
  const img = new Image();
  img.src = image;
  ctx.drawImage(img, x, y, size, size);
};

export const getBgColor = (opacity: number, type?: NodeKind) => {
  if (!type) {
    return `rgba(192, 192, 128, ${opacity})`;
  }
  switch (type) {
    case 'module':
      return `rgba(255, 173, 48, ${opacity})`;
    case 'provider':
      return `rgba(255, 87, 134, ${opacity})`;
    case 'datasource':
      return `rgba(144, 157, 255, ${opacity})`;
    default:
      return `rgba(0, 183, 189, ${opacity})`; // resource
  }
};

export const getIcon = (type?: NodeKind) => {
  if (!type) {
    return NoImageIcon;
  }
  switch (type) {
    case 'module':
      return ModuleIcon;
    case 'provider':
      return DefaultIcon;
    default:
      return ResourceIcon;
  }
};
