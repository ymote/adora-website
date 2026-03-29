import React, { useEffect, useState } from 'react';
import { ReactFlow, Background, Position, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const AMBER = '#FFB84D';
const AMBER_DARK = '#D49A30';
const TEAL = '#00D4AA';
const TEAL_DARK = '#00A882';
const INDIGO = '#4A4AFF';
const INDIGO_DARK = '#3535CC';
const NEUTRAL = '#5A5A7A';
const NEUTRAL_DARK = '#3A3A55';

const makeStyle = (bg, border) => ({
  background: bg,
  border: `2px solid ${border}`,
  borderRadius: '8px',
  padding: '10px 16px',
  minWidth: '100px',
  textAlign: 'center',
  color: '#fff',
  fontFamily: "'Geist Mono', monospace",
  fontSize: '12px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
});

const PatternNode = ({ data }) => (
  <div style={makeStyle(data.bg, data.border)}>
    <div style={{ fontWeight: 600, fontSize: '13px' }}>{data.label}</div>
  </div>
);

const LabelNode = ({ data }) => (
  <div style={{
    fontFamily: "'Geist Mono', monospace",
    fontSize: '13px',
    fontWeight: 700,
    color: '#ccc',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    textAlign: 'center',
    padding: '4px 10px',
  }}>
    {data.label}
  </div>
);

const nodeTypes = { pattern: PatternNode, label: LabelNode };

const COL1 = 0;
const COL2 = 250;
const COL3 = 500;
const COL4 = 750;

const nodes = [
  // Column labels (y=0)
  { id: 'lbl-topic', type: 'label', position: { x: COL1, y: 0 }, data: { label: 'TOPIC' } },
  { id: 'lbl-service', type: 'label', position: { x: COL2, y: 0 }, data: { label: 'SERVICE' } },
  { id: 'lbl-action', type: 'label', position: { x: COL3, y: 0 }, data: { label: 'ACTION' } },
  { id: 'lbl-streaming', type: 'label', position: { x: COL4, y: 0 }, data: { label: 'STREAMING' } },

  // Column 1: Topic
  {
    id: 'topic-pub',
    type: 'pattern',
    position: { x: COL1, y: 50 },
    data: { label: 'Publisher', bg: TEAL, border: TEAL_DARK },
    sourcePosition: Position.Bottom,
  },
  {
    id: 'topic-sub1',
    type: 'pattern',
    position: { x: COL1 - 40, y: 170 },
    data: { label: 'Subscriber', bg: NEUTRAL, border: NEUTRAL_DARK },
    targetPosition: Position.Top,
  },
  {
    id: 'topic-sub2',
    type: 'pattern',
    position: { x: COL1 + 60, y: 250 },
    data: { label: 'Subscriber', bg: NEUTRAL, border: NEUTRAL_DARK },
    targetPosition: Position.Top,
  },

  // Column 2: Service
  {
    id: 'svc-client',
    type: 'pattern',
    position: { x: COL2, y: 50 },
    data: { label: 'Client', bg: AMBER, border: AMBER_DARK },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Bottom,
  },
  {
    id: 'svc-server',
    type: 'pattern',
    position: { x: COL2, y: 200 },
    data: { label: 'Server', bg: NEUTRAL, border: NEUTRAL_DARK },
    sourcePosition: Position.Top,
    targetPosition: Position.Top,
  },

  // Column 3: Action
  {
    id: 'act-client',
    type: 'pattern',
    position: { x: COL3, y: 50 },
    data: { label: 'Client', bg: AMBER, border: AMBER_DARK },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Bottom,
  },
  {
    id: 'act-server',
    type: 'pattern',
    position: { x: COL3, y: 200 },
    data: { label: 'Server', bg: NEUTRAL, border: NEUTRAL_DARK },
    sourcePosition: Position.Top,
    targetPosition: Position.Top,
  },

  // Column 4: Streaming
  {
    id: 'str-source',
    type: 'pattern',
    position: { x: COL4, y: 50 },
    data: { label: 'Source', bg: TEAL, border: TEAL_DARK },
    sourcePosition: Position.Bottom,
  },
  {
    id: 'str-consumer',
    type: 'pattern',
    position: { x: COL4, y: 200 },
    data: { label: 'Consumer', bg: NEUTRAL, border: NEUTRAL_DARK },
    targetPosition: Position.Top,
  },
];

const edges = [
  // Topic: Publisher -> Subscribers (one-way)
  {
    id: 'e-topic-1',
    source: 'topic-pub',
    target: 'topic-sub1',
    type: 'smoothstep',
    animated: true,
    style: { stroke: TEAL, strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: TEAL },
  },
  {
    id: 'e-topic-2',
    source: 'topic-pub',
    target: 'topic-sub2',
    type: 'smoothstep',
    animated: true,
    style: { stroke: TEAL, strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: TEAL },
  },

  // Service: Client <-> Server (request down, response up)
  {
    id: 'e-svc-req',
    source: 'svc-client',
    target: 'svc-server',
    type: 'smoothstep',
    animated: true,
    label: 'request',
    labelStyle: { fontSize: '10px', fill: '#aaa', fontFamily: "'Geist', sans-serif" },
    style: { stroke: AMBER, strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: AMBER },
  },
  {
    id: 'e-svc-res',
    source: 'svc-server',
    target: 'svc-client',
    type: 'smoothstep',
    animated: true,
    label: 'response',
    labelStyle: { fontSize: '10px', fill: '#aaa', fontFamily: "'Geist', sans-serif" },
    style: { stroke: TEAL, strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: TEAL },
  },

  // Action: goal (down), feedback (up), result (up)
  {
    id: 'e-act-goal',
    source: 'act-client',
    target: 'act-server',
    type: 'smoothstep',
    animated: true,
    label: 'goal',
    labelStyle: { fontSize: '10px', fill: '#aaa', fontFamily: "'Geist', sans-serif" },
    style: { stroke: AMBER, strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: AMBER },
  },
  {
    id: 'e-act-feedback',
    source: 'act-server',
    target: 'act-client',
    type: 'smoothstep',
    animated: true,
    label: 'feedback',
    labelStyle: { fontSize: '10px', fill: '#aaa', fontFamily: "'Geist', sans-serif" },
    style: { stroke: TEAL, strokeWidth: 1.5, strokeDasharray: '4 4' },
    markerEnd: { type: MarkerType.ArrowClosed, color: TEAL },
  },
  {
    id: 'e-act-result',
    source: 'act-server',
    target: 'act-client',
    type: 'smoothstep',
    animated: true,
    label: 'result',
    labelStyle: { fontSize: '10px', fill: '#aaa', fontFamily: "'Geist', sans-serif" },
    style: { stroke: INDIGO, strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: INDIGO },
  },

  // Streaming: thick animated arrow
  {
    id: 'e-str',
    source: 'str-source',
    target: 'str-consumer',
    type: 'smoothstep',
    animated: true,
    style: { stroke: TEAL, strokeWidth: 4 },
    markerEnd: { type: MarkerType.ArrowClosed, color: TEAL },
  },
];

export default function PipelineFlow() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div style={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Geist Mono', monospace",
        fontSize: '12px',
        color: '#8A8380',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        Loading patterns...
      </div>
    );
  }

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
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
        <Background color="rgba(74, 122, 181, 0.06)" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
