import { NodeData, NodeKind } from '@renderer/types/graph';
import NoImageIcon from '../../../../assets/images/noImage64.png';

const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  lineWidth: number,
  strokeColor: string,
  fillColor: string
) => {
  const r = x + w;
  const b = y + h;
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

const fitText = (
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

const draw2Texts = (
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

const drawImage = (
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

const getBgColor = (type?: NodeKind) => {
  if (!type) {
    return 'gray';
  }
  switch (type) {
    case 'meta':
      return 'yellow';
    case 'module':
      return 'orange';
    case 'output':
      return 'purple';
    case 'provider':
      return 'blue';
    case 'var':
      return 'pink';
    default:
      return 'green';
  }
};

export const drawNode = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  node: NodeData,
  isHover: boolean
) => {
  const lineWidth = isHover ? 4 : 2;
  const bgColor = getBgColor(node.type);
  const strokeColor = isHover ? 'red' : bgColor;

  // outter rect
  drawRoundRect(context, x, y, w, h, radius, lineWidth, strokeColor, bgColor);

  const imageSize = 24;
  drawImage(context, NoImageIcon, x + 1 + imageSize / 2, y + 2, imageSize);

  // inner rect
  drawRoundRect(
    context,
    x + 1,
    y + 29,
    w - 2,
    20,
    radius,
    lineWidth,
    bgColor,
    'white'
  );

  const type = node.type || '-';
  const name = node.simpleName;
  draw2Texts(context, x, y, w, h, type, name);
};
