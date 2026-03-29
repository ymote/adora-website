import React, { useEffect, useState } from 'react';
import { ReactFlow, Background, Position, Handle, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const TEAL = '#00D4AA';
const AMBER = '#FFB84D';
const RED = '#FF4D6A';
const RED_DARK = '#CC3355';
const INDIGO = '#4A4AFF';
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
    padding: '14px 20px', minWidth: 150, textAlign: 'center', color: '#fff',
    fontFamily: "'Geist Mono', monospace", fontSize: 14,
    boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 15px ${data.border}22`,
  }}>
    <AllHandles />
    <div style={{ fontWeight: 600, fontSize: 15 }}>{data.label}</div>
    {data.sub && <div style={{ opacity: 0.7, fontSize: 12, marginTop: 3 }}>{data.sub}</div>}
  </div>
);

const nodeTypes = { box: BoxNode };
const arrow = (color) => ({ type: MarkerType.ArrowClosed, color, width: 12, height: 12 });

const nodes = [
  // Row 1: Node fault detection (left to right)
  { id: 'running', type: 'box', position: { x: 0, y: 0 }, data: { label: 'Running', sub: 'healthy', bg: '#006644', border: TEAL } },
  { id: 'crash', type: 'box', position: { x: 210, y: 0 }, data: { label: 'Node Crash', sub: 'exit != 0', bg: RED_DARK, border: RED } },
  { id: 'detect', type: 'box', position: { x: 420, y: 0 }, data: { label: 'Daemon Detects', sub: 'health check', bg: NEUTRAL_DARK, border: NEUTRAL } },
  { id: 'policy', type: 'box', position: { x: 630, y: 0 }, data: { label: 'Check Policy', sub: 'on-failure?', bg: INDIGO, border: INDIGO } },

  // Row 2: Recovery (right to left)
  { id: 'backoff', type: 'box', position: { x: 630, y: 120 }, data: { label: 'Backoff Wait', sub: 'exponential', bg: NEUTRAL_DARK, border: AMBER } },
  { id: 'restart', type: 'box', position: { x: 420, y: 120 }, data: { label: 'Respawn Node', sub: 'new process', bg: '#006644', border: TEAL } },
  { id: 'recovered', type: 'box', position: { x: 210, y: 120 }, data: { label: 'Recovered', sub: 'back online', bg: '#006644', border: TEAL } },

  // Row 3: Coordinator HA (left to right)
  { id: 'coord-crash', type: 'box', position: { x: 0, y: 260 }, data: { label: 'Coord Restart', sub: 'process crash', bg: RED_DARK, border: RED } },
  { id: 'redb', type: 'box', position: { x: 210, y: 260 }, data: { label: 'Load redb', sub: 'persistent state', bg: NEUTRAL_DARK, border: AMBER } },
  { id: 'reconnect', type: 'box', position: { x: 420, y: 260 }, data: { label: 'Daemons Reconnect', sub: 'auto backoff', bg: NEUTRAL_DARK, border: TEAL } },
  { id: 'restored', type: 'box', position: { x: 630, y: 260 }, data: { label: 'Fully Restored', sub: 'zero data loss', bg: '#006644', border: TEAL } },
];

const edges = [
  // Row 1: left to right
  { id: 'e1', source: 'running', target: 'crash', sourceHandle: 'right-src', targetHandle: 'left-tgt', type: 'smoothstep', animated: true, style: { stroke: RED, strokeWidth: 2 }, markerEnd: arrow(RED) },
  { id: 'e2', source: 'crash', target: 'detect', sourceHandle: 'right-src', targetHandle: 'left-tgt', type: 'smoothstep', animated: true, style: { stroke: NEUTRAL, strokeWidth: 2 }, markerEnd: arrow(NEUTRAL) },
  { id: 'e3', source: 'detect', target: 'policy', sourceHandle: 'right-src', targetHandle: 'left-tgt', type: 'smoothstep', animated: true, style: { stroke: INDIGO, strokeWidth: 2 }, markerEnd: arrow(INDIGO) },

  // Row 1 -> Row 2: down
  { id: 'e4', source: 'policy', target: 'backoff', sourceHandle: 'bot-src', targetHandle: 'top-tgt', type: 'smoothstep', animated: true, style: { stroke: AMBER, strokeWidth: 2 }, markerEnd: arrow(AMBER) },

  // Row 2: right to left
  { id: 'e5', source: 'backoff', target: 'restart', sourceHandle: 'left-src', targetHandle: 'right-tgt', type: 'smoothstep', animated: true, style: { stroke: TEAL, strokeWidth: 2 }, markerEnd: arrow(TEAL) },
  { id: 'e6', source: 'restart', target: 'recovered', sourceHandle: 'left-src', targetHandle: 'right-tgt', type: 'smoothstep', animated: true, style: { stroke: TEAL, strokeWidth: 2 }, markerEnd: arrow(TEAL) },

  // Row 3: left to right
  { id: 'e7', source: 'coord-crash', target: 'redb', sourceHandle: 'right-src', targetHandle: 'left-tgt', type: 'smoothstep', animated: true, style: { stroke: AMBER, strokeWidth: 2 }, markerEnd: arrow(AMBER) },
  { id: 'e8', source: 'redb', target: 'reconnect', sourceHandle: 'right-src', targetHandle: 'left-tgt', type: 'smoothstep', animated: true, style: { stroke: TEAL, strokeWidth: 2 }, markerEnd: arrow(TEAL) },
  { id: 'e9', source: 'reconnect', target: 'restored', sourceHandle: 'right-src', targetHandle: 'left-tgt', type: 'smoothstep', animated: true, style: { stroke: TEAL, strokeWidth: 2 }, markerEnd: arrow(TEAL) },
];

export default function FaultToleranceFlow() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ height: 400, display: 'grid', placeItems: 'center', color: '#5A5A7A' }}>Loading...</div>;

  return (
    <div style={{ height: 400, width: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.12 }}
        nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
        panOnDrag={false} zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false}
        preventScrolling={false} proOptions={{ hideAttribution: true }} style={{ background: 'transparent' }}>
        <Background color="rgba(0, 212, 170, 0.04)" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
