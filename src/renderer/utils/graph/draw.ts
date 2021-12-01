import { IconData } from '@renderer/types/graph';
import { TerraformType } from '@renderer/types/terraform';

export const drawShadow = (ctx: CanvasRenderingContext2D) => {
  ctx.shadowColor = '#C9CFDB';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
};

export const removeShadow = (ctx: CanvasRenderingContext2D) => {
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};

export const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  lineWidth: number,
  strokeColor: string,
  fillColor: string,
  opacity: number,
  shadow: boolean
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

  shadow && drawShadow(ctx); // draw shadow

  ctx.stroke();
  ctx.fillStyle = fillColor;
  ctx.fill();

  shadow && removeShadow(ctx); // clear shadow

  shadow && ctx.stroke(); // restroke
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

export const drawIcon = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  icon: IconData
) => {
  ctx.save();
  const horizontalScale = size / icon.width;
  const verticalScale = size / icon.height;
  const translateX = icon.translateX ? x + icon.translateX : x;
  const translateY = icon.translateY ? y + icon.translateY : y;
  ctx.transform(horizontalScale, 0, 0, verticalScale, translateX, translateY);
  ctx.fillStyle = '#fff';
  const path = new Path2D(icon.path);
  ctx.fill(path, 'evenodd');
  ctx.restore();
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
  ctx.font = `0.5rem NotoSansKR`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  const newText = fitText(ctx, text, maxWidth);
  ctx.fillText(newText, x, y);
};

export const getIconColor = (type: TerraformType, opacity: number) => {
  switch (type) {
    case 'data':
      return `rgba(144, 157, 255, ${opacity})`; // datasource
    case 'module':
      return `rgba(255, 173, 48, ${opacity})`;
    case 'provider':
      return `rgba(255, 87, 134, ${opacity})`;
    case 'resource':
      return `rgba(0, 183, 189, ${opacity})`;
    default:
      return `rgba(211, 211, 211, ${opacity})`;
  }
};

export const getBgColor = (kind: DrawingKind) => {
  switch (kind) {
    case 'selected':
      return '#D6E4FC';
    case 'hover':
      return '#F6F7F9';
    case 'drag':
      return '#B4CDF8';
    default:
      return '#FFF';
  }
};

export const getStrokeColor = (kind: DrawingKind) => {
  switch (kind) {
    case 'selected':
      return '#1968EC';
    case 'drag':
      return 'rgba(25, 104, 236, 0.20)';
    default:
      return 'rgba(201, 207, 219, 0.5)';
  }
};

export type DrawingKind = 'normal' | 'selected' | 'hover' | 'blur' | 'drag';
