import { NodeKind } from '@renderer/types/graph';

export const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  lineWidth: number,
  strokeColor: string,
  fillColor: string,
  opacity: number
) => {
  const r = x + w;
  const b = y + h;
  const radius = 4;
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

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  fillColor: string
) => {
  ctx.beginPath();
  ctx.fillStyle = fillColor;
  ctx.arc(x, y, size, 0, 2 * Math.PI, false);
  ctx.fill();
};

export const drawImage = (
  ctx: CanvasRenderingContext2D,
  src: string,
  x: number,
  y: number,
  size: number
) => {
  const img = document.createElement('img');
  img.src = src;
  ctx.drawImage(img, x, y, size, size);
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

export const drawTexts = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number
) => {
  const fontSize = 8;
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  const newText = fitText(ctx, text, maxWidth);
  ctx.fillText(newText, x, y);
};

export const getIconColor = (type: NodeKind, opacity: number) => {
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

export const getBgColor = (kind: DrawingKind) => {
  switch (kind) {
    case 'focus':
    case 'highlight':
      return '#D6E4FC';
    default:
      return '#F4F6F8';
  }
};

export const getStrokeColor = (kind: DrawingKind) => {
  switch (kind) {
    case 'focus':
      return '#1968EC';
    case 'highlight':
      return '#C9CFDB';
    default:
      return '#F4F6F8';
  }
};

export type DrawingKind = 'normal' | 'focus' | 'highlight' | 'blur';
