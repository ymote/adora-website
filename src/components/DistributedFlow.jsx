import React, { useEffect, useState } from 'react';
import { ReactFlow, Background, Position, Handle, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const TEAL = '#00D4AA';
const TEAL_DARK = '#00A882';
const AMBER = '#FFB84D';
const AMBER_DARK = '#D49A30';
const INDIGO = '#4A4AFF';
const INDIGO_DARK = '#3535CC';
const NEUTRAL = '#5A5A7A';
const NEUTRAL_DARK = '#3A3A55';

const hs = { background: 'transparent', border: 'none', width: 1, height: 1 };

const AllHandles = () => (
  <>
    <Handle type="source" position={Position.Top} id="top-src" style={hs} />
    <Handle type="target" position={Position.Top} id="top-tgt" style={hs} />
    <Handle type="source" position={Position.Bottom} id="bot-src" style={hs} />
    <Handle type="target" position={Position.Bottom} id="bot-tgt" style={hs} />
    <Handle type="source" position={Position.Left} id="left-src" style={hs} />
    <Handle type="target" position={Position.Left} id="left-tgt" style={hs} />
    <Handle type="source" position={Position.Right} id="right-src" style={hs} />
    <Handle type="target" position={Position.Right} id="right-tgt" style={hs} />
  </>
);

const BoxNode = ({ data }) => (
  <div style={{
    background: data.bg, border: `2px solid ${data.border}`, borderRadius: 10,
    padding: '12px 18px', minWidth: data.wide ? 200 : 140, textAlign: 'center', color: '#fff',
    fontFamily: "'Geist Mono', monospace", fontSize: 14,
    boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 15px ${data.border}22`,
  }}>
    <AllHandles />
    <div style={{ fontWeight: 600, fontSize: 15 }}>{data.label}</div>
    {data.sub && <div style={{ opacity: 0.7, fontSize: 11, marginTop: 3 }}>{data.sub}</div>}
  </div>
);

const GroupNode = ({ data }) => (
  <div style={{
    border: `2px dashed ${data.border}`, borderRadius: 12, padding: '10px 16px',
    minWidth: 280, minHeight: data.height || 120, background: `${data.bg}08`,
    fontFamily: "'Geist Mono', monospace",
  }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: data.border, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
      {data.label}
    </div>
  </div>
);

const nodeTypes = { box: BoxNode, group: GroupNode };
const arrow = (color) => ({ type: MarkerType.ArrowClosed, color, width: 12, height: 12 });

const nodes = [
  { id: 'g1', type: 'group', position: { x: 0, y: 80 }, data: { label: 'Machine A (GPU)', border: INDIGO, bg: INDIGO, height: 260 } },
  { id: 'g2', type: 'group', position: { x: 520, y: 80 }, data: { label: 'Machine B (ARM)', border: TEAL, bg: TEAL, height: 260 } },

  { id: 'coord', type: 'box', position: { x: 280, y: 0 }, data: { label: 'Coordinator', sub: 'WS :6013', bg: TEAL_DARK, border: TEAL, wide: true } },

  { id: 'daemon-a', type: 'box', position: { x: 50, y: 120 }, data: { label: 'Daemon A', bg: INDIGO, border: INDIGO_DARK } },
  { id: 'cam', type: 'box', position: { x: 20, y: 240 }, data: { label: 'Webcam', sub: 'GPU node', bg: NEUTRAL, border: NEUTRAL_DARK } },
  { id: 'yolo', type: 'box', position: { x: 220, y: 240 }, data: { label: 'YOLO v8', sub: 'GPU node', bg: NEUTRAL, border: NEUTRAL_DARK } },

  { id: 'daemon-b', type: 'box', position: { x: 570, y: 120 }, data: { label: 'Daemon B', bg: TEAL_DARK, border: TEAL } },
  { id: 'planner', type: 'box', position: { x: 540, y: 240 }, data: { label: 'Planner', sub: 'ARM node', bg: NEUTRAL, border: NEUTRAL_DARK } },
  { id: 'actuator', type: 'box', position: { x: 740, y: 240 }, data: { label: 'Actuator', sub: 'ARM node', bg: NEUTRAL, border: NEUTRAL_DARK } },

  { id: 'zenoh', type: 'group', position: { x: 120, y: 380 }, data: { label: 'Zenoh Data Plane — zero-copy cross-machine', border: AMBER, bg: AMBER, height: 35 } },
];

const edges = [
  { id: 'e1', source: 'coord', target: 'daemon-a', sourceHandle: 'bot-src', targetHandle: 'top-tgt', type: 'smoothstep', animated: true, style: { stroke: TEAL, strokeWidth: 2 }, markerEnd: arrow(TEAL) },
  { id: 'e2', source: 'coord', target: 'daemon-b', sourceHandle: 'bot-src', targetHandle: 'top-tgt', type: 'smoothstep', animated: true, style: { stroke: TEAL, strokeWidth: 2 }, markerEnd: arrow(TEAL) },

  { id: 'e3', source: 'daemon-a', target: 'cam', sourceHandle: 'bot-src', targetHandle: 'top-tgt', type: 'smoothstep', animated: true, style: { stroke: INDIGO, strokeWidth: 1.5 } },
  { id: 'e4', source: 'daemon-a', target: 'yolo', sourceHandle: 'bot-src', targetHandle: 'top-tgt', type: 'smoothstep', animated: true, style: { stroke: INDIGO, strokeWidth: 1.5 } },

  { id: 'e5', source: 'daemon-b', target: 'planner', sourceHandle: 'bot-src', targetHandle: 'top-tgt', type: 'smoothstep', animated: true, style: { stroke: TEAL, strokeWidth: 1.5 } },
  { id: 'e6', source: 'daemon-b', target: 'actuator', sourceHandle: 'bot-src', targetHandle: 'top-tgt', type: 'smoothstep', animated: true, style: { stroke: TEAL, strokeWidth: 1.5 } },

  // Cross-machine via Zenoh
  { id: 'e7', source: 'yolo', target: 'planner', sourceHandle: 'right-src', targetHandle: 'left-tgt', type: 'smoothstep', animated: true, style: { stroke: AMBER, strokeWidth: 3 }, markerEnd: arrow(AMBER), label: 'bbox data', labelStyle: { fontSize: 11, fill: AMBER } },

  // Intra-machine SHM
  { id: 'e8', source: 'cam', target: 'yolo', sourceHandle: 'right-src', targetHandle: 'left-tgt', type: 'smoothstep', animated: true, style: { stroke: NEUTRAL, strokeWidth: 2 }, markerEnd: arrow(NEUTRAL), label: 'SHM', labelStyle: { fontSize: 10, fill: '#888' } },
  { id: 'e9', source: 'planner', target: 'actuator', sourceHandle: 'right-src', targetHandle: 'left-tgt', type: 'smoothstep', animated: true, style: { stroke: NEUTRAL, strokeWidth: 2 }, markerEnd: arrow(NEUTRAL), label: 'SHM', labelStyle: { fontSize: 10, fill: '#888' } },
];

export default function DistributedFlow() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ height: 500, display: 'grid', placeItems: 'center', color: '#5A5A7A' }}>Loading...</div>;

  return (
    <div style={{ height: 500, width: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.12 }}
        nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
        panOnDrag={false} zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false}
        preventScrolling={false} proOptions={{ hideAttribution: true }} style={{ background: 'transparent' }}>
        <Background color="rgba(0, 212, 170, 0.04)" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
