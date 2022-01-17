/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable import/extensions */
import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';
import { GraphData } from 'react-force-graph-2d';
import { LinkData, NodeData, ROOT_NAME } from '@renderer/types/graph';

const parseDOT = async (src: string): Promise<any> => {
  const viz = new Viz({ Module, render });
  const jsonObj = await viz.renderJSONObject(src);
  // jsonObj format docs here: http://www.graphviz.org/docs/outputs/json/
  return jsonObj;
};

const getRawNode = (objects: any = []): NodeData[] => {
  return objects
    ?.filter((node: any) => node.name !== ROOT_NAME)
    .map((node: any) => {
      const fullName = node.name.replace('[root] ', '');
      return { id: node._gvid, fullName };
    });
};

const getRawLink = (edges: any = []): LinkData[] => {
  return edges.map((link: any) => {
    return { source: link.head, target: link.tail };
  });
};

export const getRawGraph = async (src: string): Promise<GraphData> => {
  const jsonObj = await parseDOT(src);
  const nodes = getRawNode(jsonObj.objects);
  const links = getRawLink(jsonObj.edges);
  return { nodes, links };
};
