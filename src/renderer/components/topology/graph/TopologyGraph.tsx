import * as React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import ReactResizeDetector from 'react-resize-detector';
import Box from '@mui/material/Box';

const TopologyGraph = () => {
  const graphRef = React.useRef();

  const [canvasSize, setCanvasSize] = React.useState({
    width: 0,
    height: 0,
  });

  const genRandomTree = (N = 10, reverse = false) => {
    return {
      nodes: [...Array(N).keys()].map((i) => ({ id: i })),
      links: [...Array(N).keys()]
        .filter((id) => id)
        .map((id) => ({
          [reverse ? 'target' : 'source']: id,
          [reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1)),
        })),
    };
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <ReactResizeDetector
        handleWidth
        handleHeight
        onResize={(width, height) =>
          setCanvasSize({ width: width || 0, height: height || 0 })
        }
      />
      {canvasSize.width && canvasSize.height && (
        <ForceGraph2D
          ref={graphRef}
          width={canvasSize.width}
          height={canvasSize.height}
          graphData={genRandomTree()}
        />
      )}
    </Box>
  );
};

export default TopologyGraph;
