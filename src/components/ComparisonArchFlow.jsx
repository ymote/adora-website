import { useState, useEffect } from 'react';
import { ReactFlow, Background, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const TEAL = '#00D4AA';
const TEAL_DARK = '#00A882';
const AMBER = '#FFB84D';
const AMBER_DARK = '#D49A30';
const MUTED = '#5A5A7A';
const MUTED_DARK = '#3A3A55';
const INDIGO = '#4A4AFF';

function ArchNode({ data }) {
  return (
    <div
      style={{
        background: data.bg,
        border: `1.5px solid ${data.border}`,
        borderRadius: 8,
        padding: '8px 16px',
        color: '#FAFAFA',
        fontSize: 12,
        fontFamily: "'Geist Mono', monospace",
        textAlign: 'center',
        minWidth: data.wide ? 160 : 100,
        opacity: data.muted ? 0.5 : 1,
      }}
    >
      <div style={{ fontWeight: 500, fontSize: 13 }}>{data.label}</div>
      {data.sub && <div style={{ fontSize: 10, color: '#8888AA', marginTop: 2 }}>{data.sub}</div>}
    </div>
  );
}

function LabelNode({ data }) {
  return (
    <div
      style={{
        fontSize: 14,
        fontFamily: "'Geist', sans-serif",
        fontWeight: 500,
        color: data.color || '#8888AA',
        textAlign: 'center',
        padding: '4px 12px',
        borderBottom: `2px solid ${data.color || '#8888AA'}`,
      }}
    >
      {data.label}
    </div>
  );
}

const nodeTypes = { arch: ArchNode, label: LabelNode };

// Left side: original dora (muted)
const doraNodes = [
  { id: 'dl', type: 'label', position: { x: 60, y: 0 }, data: { label: 'dora (original)', color: MUTED } },
  { id: 'd-cli', type: 'arch', position: { x: 50, y: 50 }, data: { label: 'dora CLI', bg: MUTED_DARK, border: MUTED, muted: true }, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'd-coord', type: 'arch', position: { x: 30, y: 130 }, data: { label: 'Coordinator', sub: 'TCP', bg: MUTED_DARK, border: MUTED, muted: true, wide: true }, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'd-daemon', type: 'arch', position: { x: 50, y: 210 }, data: { label: 'Daemon', bg: MUTED_DARK, border: MUTED, muted: true }, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'd-n1', type: 'arch', position: { x: 10, y: 290 }, data: { label: 'Node A', bg: MUTED_DARK, border: MUTED, muted: true }, targetPosition: Position.Top },
  { id: 'd-n2', type: 'arch', position: { x: 120, y: 290 }, data: { label: 'Node B', bg: MUTED_DARK, border: MUTED, muted: true }, targetPosition: Position.Top },
];

const doraEdges = [
  { id: 'de1', source: 'd-cli', target: 'd-coord', style: { stroke: MUTED, strokeWidth: 1.5, opacity: 0.5 } },
  { id: 'de2', source: 'd-coord', target: 'd-daemon', style: { stroke: MUTED, strokeWidth: 1.5, opacity: 0.5 } },
  { id: 'de3', source: 'd-daemon', target: 'd-n1', style: { stroke: MUTED, strokeWidth: 1, opacity: 0.4 } },
  { id: 'de4', source: 'd-daemon', target: 'd-n2', style: { stroke: MUTED, strokeWidth: 1, opacity: 0.4 } },
];

// Right side: Adora (vibrant)
const adoraNodes = [
  { id: 'al', type: 'label', position: { x: 460, y: 0 }, data: { label: 'Adora', color: TEAL } },
  { id: 'a-cli', type: 'arch', position: { x: 440, y: 50 }, data: { label: 'ADORA CLI', bg: AMBER_DARK, border: AMBER, wide: true }, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'a-coord', type: 'arch', position: { x: 430, y: 130 }, data: { label: 'Coordinator', sub: 'WebSocket :6013', bg: TEAL_DARK, border: TEAL, wide: true }, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'a-d1', type: 'arch', position: { x: 330, y: 220 }, data: { label: 'Daemon 1', bg: '#2A2A66', border: INDIGO }, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'a-d2', type: 'arch', position: { x: 460, y: 220 }, data: { label: 'Daemon 2', bg: '#2A2A66', border: INDIGO }, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'a-d3', type: 'arch', position: { x: 590, y: 220 }, data: { label: 'Daemon 3', bg: '#2A2A66', border: INDIGO }, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'a-zenoh', type: 'arch', position: { x: 380, y: 280 }, data: { label: 'Zenoh Data Plane', bg: 'transparent', border: TEAL, wide: true }, targetPosition: Position.Top },
  { id: 'a-n1', type: 'arch', position: { x: 310, y: 340 }, data: { label: 'Node A', bg: MUTED_DARK, border: MUTED }, targetPosition: Position.Top },
  { id: 'a-n2', type: 'arch', position: { x: 400, y: 340 }, data: { label: 'Node B', bg: MUTED_DARK, border: MUTED }, targetPosition: Position.Top },
  { id: 'a-n3', type: 'arch', position: { x: 500, y: 340 }, data: { label: 'Node C', bg: MUTED_DARK, border: MUTED }, targetPosition: Position.Top },
  { id: 'a-n4', type: 'arch', position: { x: 600, y: 340 }, data: { label: 'Node D', bg: MUTED_DARK, border: MUTED }, targetPosition: Position.Top },
];

const adoraEdges = [
  { id: 'ae1', source: 'a-cli', target: 'a-coord', animated: true, style: { stroke: AMBER, strokeWidth: 2 } },
  { id: 'ae2', source: 'a-coord', target: 'a-d1', animated: true, style: { stroke: TEAL, strokeWidth: 1.5 } },
  { id: 'ae3', source: 'a-coord', target: 'a-d2', animated: true, style: { stroke: TEAL, strokeWidth: 1.5 } },
  { id: 'ae4', source: 'a-coord', target: 'a-d3', animated: true, style: { stroke: TEAL, strokeWidth: 1.5 } },
  { id: 'ae5', source: 'a-d1', target: 'a-n1', style: { stroke: INDIGO, strokeWidth: 1 } },
  { id: 'ae6', source: 'a-d1', target: 'a-n2', style: { stroke: INDIGO, strokeWidth: 1 } },
  { id: 'ae7', source: 'a-d2', target: 'a-n3', style: { stroke: INDIGO, strokeWidth: 1 } },
  { id: 'ae8', source: 'a-d3', target: 'a-n4', style: { stroke: INDIGO, strokeWidth: 1 } },
  { id: 'ae9', source: 'a-d1', target: 'a-zenoh', style: { stroke: TEAL, strokeWidth: 1, strokeDasharray: '4 4' } },
  { id: 'ae10', source: 'a-d2', target: 'a-zenoh', style: { stroke: TEAL, strokeWidth: 1, strokeDasharray: '4 4' } },
  { id: 'ae11', source: 'a-d3', target: 'a-zenoh', style: { stroke: TEAL, strokeWidth: 1, strokeDasharray: '4 4' } },
];

const nodes = [...doraNodes, ...adoraNodes];
const edges = [...doraEdges, ...adoraEdges];

export default function ComparisonArchFlow() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div style={{ height: 420, display: 'grid', placeItems: 'center', color: '#5A5A7A' }}>Loading diagram...</div>;
  }

  return (
    <div style={{ height: 420, width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="transparent" />
      </ReactFlow>
    </div>
  );
}
