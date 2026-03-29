import React, { useEffect, useState } from 'react';
import { ReactFlow, Background, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const AMBER = '#FFB84D';
const AMBER_DARK = '#D49A30';
const TEAL = '#00D4AA';
const TEAL_DARK = '#00A882';
const INDIGO = '#4A4AFF';
const INDIGO_DARK = '#3535CC';
const NEUTRAL = '#5A5A7A';
const NEUTRAL_DARK = '#3A3A55';

const makeNodeStyle = (bg, border) => ({
  background: bg,
  border: `2px solid ${border}`,
  borderRadius: '8px',
  padding: '10px 14px',
  minWidth: '140px',
  textAlign: 'center',
  color: '#fff',
  fontFamily: "'Geist Mono', monospace",
  fontSize: '12px',
  letterSpacing: '0.02em',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
});

const AdoraNode = ({ data }) => (
  <div style={makeNodeStyle(data.bg, data.border)}>
    <div style={{ fontWeight: 600, fontSize: '13px' }}>{data.label}</div>
    {data.description && (
      <div style={{ opacity: 0.8, marginTop: '4px', fontSize: '11px', fontFamily: "'Geist', sans-serif" }}>
        {data.description}
      </div>
    )}
  </div>
);

const EntryNode = ({ data }) => (
  <div style={{
    ...makeNodeStyle(AMBER, AMBER_DARK),
    color: '#1a1a2e',
    minWidth: '200px',
    fontSize: '14px',
    fontWeight: 700,
  }}>
    <div>{data.label}</div>
    {data.description && (
      <div style={{ opacity: 0.7, marginTop: '4px', fontSize: '11px', fontFamily: "'Geist', sans-serif" }}>
        {data.description}
      </div>
    )}
  </div>
);

const ZenohNode = ({ data }) => (
  <div style={{
    background: 'rgba(74, 74, 255, 0.08)',
    border: `2px dashed ${INDIGO}`,
    borderRadius: '8px',
    padding: '8px 14px',
    minWidth: '560px',
    textAlign: 'center',
    color: INDIGO,
    fontFamily: "'Geist Mono', monospace",
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.04em',
  }}>
    {data.label}
  </div>
);

const nodeTypes = {
  adora: AdoraNode,
  entry: EntryNode,
  zenoh: ZenohNode,
};

const initialNodes = [
  // Row 0: CLI entry
  {
    id: 'cli',
    type: 'entry',
    position: { x: 280, y: 0 },
    data: { label: 'ADORA CLI' },
    sourcePosition: Position.Bottom,
  },

  // Row 1: Coordinator
  {
    id: 'coordinator',
    type: 'adora',
    position: { x: 280, y: 120 },
    data: { label: 'Coordinator', description: 'WebSocket control plane', bg: TEAL, border: TEAL_DARK },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Row 2: Daemons
  {
    id: 'daemon1',
    type: 'adora',
    position: { x: 60, y: 240 },
    data: { label: 'Daemon (host-1)', bg: INDIGO, border: INDIGO_DARK },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'daemon2',
    type: 'adora',
    position: { x: 280, y: 240 },
    data: { label: 'Daemon (host-2)', bg: INDIGO, border: INDIGO_DARK },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'daemon3',
    type: 'adora',
    position: { x: 500, y: 240 },
    data: { label: 'Daemon (host-3)', bg: INDIGO, border: INDIGO_DARK },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Row 2.5: Zenoh Data Plane
  {
    id: 'zenoh',
    type: 'zenoh',
    position: { x: 60, y: 300 },
    data: { label: 'Zenoh Data Plane' },
  },

  // Row 3: Nodes under each daemon
  {
    id: 'nodeA',
    type: 'adora',
    position: { x: 20, y: 360 },
    data: { label: 'Node A', bg: NEUTRAL, border: NEUTRAL_DARK },
    targetPosition: Position.Top,
  },
  {
    id: 'nodeB',
    type: 'adora',
    position: { x: 140, y: 360 },
    data: { label: 'Node B', bg: NEUTRAL, border: NEUTRAL_DARK },
    targetPosition: Position.Top,
  },
  {
    id: 'nodeC',
    type: 'adora',
    position: { x: 240, y: 360 },
    data: { label: 'Node C', bg: NEUTRAL, border: NEUTRAL_DARK },
    targetPosition: Position.Top,
  },
  {
    id: 'nodeD',
    type: 'adora',
    position: { x: 360, y: 360 },
    data: { label: 'Node D', bg: NEUTRAL, border: NEUTRAL_DARK },
    targetPosition: Position.Top,
  },
  {
    id: 'nodeE',
    type: 'adora',
    position: { x: 460, y: 360 },
    data: { label: 'Node E', bg: NEUTRAL, border: NEUTRAL_DARK },
    targetPosition: Position.Top,
  },
  {
    id: 'nodeF',
    type: 'adora',
    position: { x: 580, y: 360 },
    data: { label: 'Node F', bg: NEUTRAL, border: NEUTRAL_DARK },
    targetPosition: Position.Top,
  },
];

const tealEdge = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: TEAL, strokeWidth: 2 },
};

const indigoEdge = {
  type: 'smoothstep',
  style: { stroke: INDIGO, strokeWidth: 2 },
};

const dashedEdge = {
  type: 'smoothstep',
  style: { stroke: INDIGO, strokeWidth: 1.5, strokeDasharray: '5 5' },
};

const initialEdges = [
  // CLI -> Coordinator
  { id: 'e-cli-coord', source: 'cli', target: 'coordinator', ...tealEdge },

  // Coordinator -> Daemons
  { id: 'e-coord-d1', source: 'coordinator', target: 'daemon1', ...tealEdge },
  { id: 'e-coord-d2', source: 'coordinator', target: 'daemon2', ...tealEdge },
  { id: 'e-coord-d3', source: 'coordinator', target: 'daemon3', ...tealEdge },

  // Daemons -> Nodes
  { id: 'e-d1-a', source: 'daemon1', target: 'nodeA', ...indigoEdge },
  { id: 'e-d1-b', source: 'daemon1', target: 'nodeB', ...indigoEdge },
  { id: 'e-d2-c', source: 'daemon2', target: 'nodeC', ...indigoEdge },
  { id: 'e-d2-d', source: 'daemon2', target: 'nodeD', ...indigoEdge },
  { id: 'e-d3-e', source: 'daemon3', target: 'nodeE', ...indigoEdge },
  { id: 'e-d3-f', source: 'daemon3', target: 'nodeF', ...indigoEdge },

  // Zenoh -> Daemons (dashed)
  { id: 'e-z-d1', source: 'zenoh', target: 'daemon1', ...dashedEdge },
  { id: 'e-z-d2', source: 'zenoh', target: 'daemon2', ...dashedEdge },
  { id: 'e-z-d3', source: 'zenoh', target: 'daemon3', ...dashedEdge },
];

export default function ArchitectureFlow() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Geist Mono', monospace",
        fontSize: '12px',
        color: '#8A8380',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        Loading architecture...
      </div>
    );
  }

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'transparent' }}
      >
        <Background color="rgba(74, 122, 181, 0.08)" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
