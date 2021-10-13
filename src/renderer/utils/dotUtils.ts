/* eslint-disable  @typescript-eslint/ban-types */
/* eslint-disable  import/extensions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-useless-escape */
import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';
import { GraphData, NodeObject, LinkObject } from 'react-force-graph-2d';

// 임시 dot string
const dot = `digraph {
	compound = \"true\"
	newrank = \"true\"
	subgraph \"root\" {
		\"[root] aws_instance.ubuntu-ssh-server (expand)\" [label = \"aws_instance.ubuntu-ssh-server\", shape = \"box\"]
		\"[root] aws_key_pair.terraform-key (expand)\" [label = \"aws_key_pair.terraform-key\", shape = \"box\"]
		\"[root] module.aws-network-configs.aws_internet_gateway.test-gateway (expand)\" [label = \"module.aws-network-configs.aws_internet_gateway.test-gateway\", shape = \"box\"]
		\"[root] module.aws-network-configs.aws_route_table.test-route-table (expand)\" [label = \"module.aws-network-configs.aws_route_table.test-route-table\", shape = \"box\"]
		\"[root] module.aws-network-configs.aws_route_table_association.my-subnet-association (expand)\" [label = \"module.aws-network-configs.aws_route_table_association.my-subnet-association\", shape = \"box\"]
		\"[root] module.aws-network-configs.aws_security_group.test-sg (expand)\" [label = \"module.aws-network-configs.aws_security_group.test-sg\", shape = \"box\"]
		\"[root] module.aws-network-configs.aws_security_group_rule.instance-ssh (expand)\" [label = \"module.aws-network-configs.aws_security_group_rule.instance-ssh\", shape = \"box\"]
		\"[root] module.aws-network-configs.aws_security_group_rule.outbound-traffic (expand)\" [label = \"module.aws-network-configs.aws_security_group_rule.outbound-traffic\", shape = \"box\"]
		\"[root] module.aws-network-configs.aws_security_group_rule.test-cluster-traffic (expand)\" [label = \"module.aws-network-configs.aws_security_group_rule.test-cluster-traffic\", shape = \"box\"]
		\"[root] module.aws-network-configs.aws_subnet.test-subnet-a (expand)\" [label = \"module.aws-network-configs.aws_subnet.test-subnet-a\", shape = \"box\"]
		\"[root] module.aws-network-configs.aws_vpc.test-vpc (expand)\" [label = \"module.aws-network-configs.aws_vpc.test-vpc\", shape = \"box\"]
		\"[root] provider[\\"registry.terraform.io/hashicorp/aws\\"]\" [label = \"provider[\\"registry.terraform.io/hashicorp/aws\\"]\", shape = \"diamond\"]
		\"[root] provider[\\"registry.terraform.io/hashicorp/tls\\"]\" [label = \"provider[\\"registry.terraform.io/hashicorp/tls\\"]\", shape = \"diamond\"]
		\"[root] tls_private_key.example (expand)\" [label = \"tls_private_key.example\", shape = \"box\"]
		\"[root] var.key_pair\" [label = \"var.key_pair\", shape = \"note\"]
		\"[root] aws_instance.ubuntu-ssh-server (expand)\" -> \"[root] module.aws-network-configs.output.test-sg-id (expand)\"
		\"[root] aws_instance.ubuntu-ssh-server (expand)\" -> \"[root] module.aws-network-configs.output.test-subnet-a-id (expand)\"
		\"[root] aws_instance.ubuntu-ssh-server (expand)\" -> \"[root] var.key_pair\"
		\"[root] aws_key_pair.terraform-key (expand)\" -> \"[root] provider[\\"registry.terraform.io/hashicorp/aws\\"]\"
		\"[root] aws_key_pair.terraform-key (expand)\" -> \"[root] tls_private_key.example (expand)\"
		\"[root] meta.count-boundary (EachMode fixup)\" -> \"[root] aws_instance.ubuntu-ssh-server (expand)\"
		\"[root] meta.count-boundary (EachMode fixup)\" -> \"[root] aws_key_pair.terraform-key (expand)\"
		\"[root] meta.count-boundary (EachMode fixup)\" -> \"[root] module.aws-network-configs (close)\"
		\"[root] module.aws-network-configs (close)\" -> \"[root] module.aws-network-configs.aws_internet_gateway.test-gateway (expand)\"
		\"[root] module.aws-network-configs (close)\" -> \"[root] module.aws-network-configs.aws_route_table_association.my-subnet-association (expand)\"
		\"[root] module.aws-network-configs (close)\" -> \"[root] module.aws-network-configs.aws_security_group_rule.instance-ssh (expand)\"
		\"[root] module.aws-network-configs (close)\" -> \"[root] module.aws-network-configs.aws_security_group_rule.outbound-traffic (expand)\"
		\"[root] module.aws-network-configs (close)\" -> \"[root] module.aws-network-configs.aws_security_group_rule.test-cluster-traffic (expand)\"
		\"[root] module.aws-network-configs (close)\" -> \"[root] module.aws-network-configs.output.test-sg-id (expand)\"
		\"[root] module.aws-network-configs (close)\" -> \"[root] module.aws-network-configs.output.test-subnet-a-id (expand)\"
		\"[root] module.aws-network-configs.aws_internet_gateway.test-gateway (expand)\" -> \"[root] module.aws-network-configs.aws_vpc.test-vpc (expand)\"
		\"[root] module.aws-network-configs.aws_route_table.test-route-table (expand)\" -> \"[root] module.aws-network-configs.aws_vpc.test-vpc (expand)\"
		\"[root] module.aws-network-configs.aws_route_table_association.my-subnet-association (expand)\" -> \"[root] module.aws-network-configs.aws_route_table.test-route-table (expand)\"
		\"[root] module.aws-network-configs.aws_route_table_association.my-subnet-association (expand)\" -> \"[root] module.aws-network-configs.aws_subnet.test-subnet-a (expand)\"
		\"[root] module.aws-network-configs.aws_security_group.test-sg (expand)\" -> \"[root] module.aws-network-configs.aws_vpc.test-vpc (expand)\"
		\"[root] module.aws-network-configs.aws_security_group_rule.instance-ssh (expand)\" -> \"[root] module.aws-network-configs.aws_security_group.test-sg (expand)\"
		\"[root] module.aws-network-configs.aws_security_group_rule.outbound-traffic (expand)\" -> \"[root] module.aws-network-configs.aws_security_group.test-sg (expand)\"
		\"[root] module.aws-network-configs.aws_security_group_rule.test-cluster-traffic (expand)\" -> \"[root] module.aws-network-configs.aws_security_group.test-sg (expand)\"
		\"[root] module.aws-network-configs.aws_subnet.test-subnet-a (expand)\" -> \"[root] module.aws-network-configs.aws_vpc.test-vpc (expand)\"
		\"[root] module.aws-network-configs.aws_vpc.test-vpc (expand)\" -> \"[root] module.aws-network-configs (expand)\"
		\"[root] module.aws-network-configs.aws_vpc.test-vpc (expand)\" -> \"[root] provider[\\"registry.terraform.io/hashicorp/aws\\"]\"
		\"[root] module.aws-network-configs.output.test-sg-id (expand)\" -> \"[root] module.aws-network-configs.aws_security_group.test-sg (expand)\"
		\"[root] module.aws-network-configs.output.test-subnet-a-id (expand)\" -> \"[root] module.aws-network-configs.aws_subnet.test-subnet-a (expand)\"
		\"[root] provider[\\"registry.terraform.io/hashicorp/aws\\"] (close)\" -> \"[root] aws_instance.ubuntu-ssh-server (expand)\"
		\"[root] provider[\\"registry.terraform.io/hashicorp/aws\\"] (close)\" -> \"[root] aws_key_pair.terraform-key (expand)\"
		\"[root] provider[\\"registry.terraform.io/hashicorp/aws\\"] (close)\" -> \"[root] module.aws-network-configs.aws_internet_gateway.test-gateway (expand)\"
		\"[root] provider[\\"registry.terraform.io/hashicorp/aws\\"] (close)\" -> \"[root] module.aws-network-configs.aws_route_table_association.my-subnet-association (expand)\"
		\"[root] provider[\\"registry.terraform.io/hashicorp/aws\\"] (close)\" -> \"[root] module.aws-network-configs.aws_security_group_rule.instance-ssh (expand)\"
		\"[root] provider[\\"registry.terraform.io/hashicorp/aws\\"] (close)\" -> \"[root] module.aws-network-configs.aws_security_group_rule.outbound-traffic (expand)\"
		\"[root] provider[\\"registry.terraform.io/hashicorp/aws\\"] (close)\" -> \"[root] module.aws-network-configs.aws_security_group_rule.test-cluster-traffic (expand)\"
		\"[root] provider[\\"registry.terraform.io/hashicorp/tls\\"] (close)\" -> \"[root] tls_private_key.example (expand)\"
		\"[root] root\" -> \"[root] meta.count-boundary (EachMode fixup)\"
		\"[root] root\" -> \"[root] provider[\\"registry.terraform.io/hashicorp/aws\\"] (close)\"
		\"[root] root\" -> \"[root] provider[\\"registry.terraform.io/hashicorp/tls\\"] (close)\"
		\"[root] tls_private_key.example (expand)\" -> \"[root] provider[\\"registry.terraform.io/hashicorp/tls\\"]\"
	}
}
`;

export const parseDOTString = async (src?: string): Promise<object> => {
  const viz = new Viz({ Module, render });
  const jsonObj = await viz.renderJSONObject(src || dot);
  // json format docs here: http://www.graphviz.org/docs/outputs/json/
  return jsonObj;
};

export const getNodeData = (jsonObject: any): NodeData[] => {
  return jsonObject.objects
    ?.filter((node: any) => node.name !== 'root')
    .map((node: any) => {
      const name = node.name.replace('[root] ', '');
      return {
        id: node._gvid,
        name,
        shape: name === 'root' ? 'text' : node.shape || 'circle',
      };
    });
};

export const getLinkData = (jsonObject: any): LinkObject[] => {
  return jsonObject.edges?.map((link: any) => {
    return { source: link.tail, target: link.head };
  });
};

export const getGraphData = async (src?: string): Promise<GraphData> => {
  const jsonObj = await parseDOTString(src);
  return { nodes: getNodeData(jsonObj), links: getLinkData(jsonObj) };
};

export interface NodeExtraObject {
  name?: string;
  shape?: string;
}

export type NodeData = NodeObject & NodeExtraObject;
