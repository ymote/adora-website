import React, { useEffect, useState } from 'react';
import { ReactFlow, Background, Position, Handle, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const AMBER = '#FFB84D';
const AMBER_DARK = '#D49A30';
const TEAL = '#00D4AA';
const TEAL_DARK = '#00A882';
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

const PatternNode = ({ data }) => (
  <div style={{
    background: data.bg, border: `2px solid ${data.border}`, borderRadius: '10px',
    padding: '12px 18px', minWidth: '120px', textAlign: 'center', color: '#fff',
    fontFamily: "'Geist Mono', monospace", fontSize: '14px',
    boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 15px ${data.border}22`,
  }}>
    <AllHandles />
    <div style={{ fontWeight: 600, fontSize: '15px' }}>{data.label}</div>
  </div>
);

const LabelNode = ({ data }) => (
  <div style={{
    fontFamily: "'Geist Mono', monospace", fontSize: '15px', fontWeight: 700,
    color: data.color || '#ccc', textTransform: 'uppercase', letterSpacing: '0.08em',
    textAlign: 'center', padding: '4px 10px', borderBottom: `2px solid ${data.color || '#555'}`,
  }}>
    {data.label}
  </div>
);

const nodeTypes = { pattern: PatternNode, label: LabelNode };
const arrow = (color) => ({ type: MarkerType.ArrowClosed, color, width: 12, height: 12 });

const COL1 = 0, COL2 = 220, COL3 = 440, COL4 = 660;

const nodes = [
  { id: 'lbl-topic', type: 'label', position: { x: COL1 + 10, y: 0 }, data: { label: 'TOPIC', color: TEAL } },
  { id: 'lbl-service', type: 'label', position: { x: COL2 + 10, y: 0 }, data: { label: 'SERVICE', color: AMBER } },
  { id: 'lbl-action', type: 'label', position: { x: COL3 + 10, y: 0 }, data: { label: 'ACTION', color: AMBER } },
  { id: 'lbl-streaming', type: 'label', position: { x: COL4 + 10, y: 0 }, data: { label: 'STREAMING', color: TEAL } },

  { id: 'topic-pub', type: 'pattern', position: { x: COL1, y: 50 }, data: { label: 'Publisher', bg: TEAL, border: TEAL_DARK } },
  { id: 'topic-sub1', type: 'pattern', position: { x: COL1 - 30, y: 180 }, data: { label: 'Subscriber A', bg: NEUTRAL, border: NEUTRAL_DARK } },
  { id: 'topic-sub2', type: 'pattern', position: { x: COL1 + 50, y: 260 }, data: { label: 'Subscriber B', bg: NEUTRAL, border: NEUTRAL_DARK } },

  { id: 'svc-client', type: 'pattern', position: { x: COL2, y: 50 }, data: { label: 'Client', bg: AMBER, border: AMBER_DARK } },
  { id: 'svc-server', type: 'pattern', position: { x: COL2, y: 210 }, data: { label: 'Server', bg: NEUTRAL, border: NEUTRAL_DARK } },

  { id: 'act-client', type: 'pattern', position: { x: COL3, y: 50 }, data: { label: 'Client', bg: AMBER, border: AMBER_DARK } },
  { id: 'act-server', type: 'pattern', position: { x: COL3, y: 210 }, data: { label: 'Server', bg: NEUTRAL, border: NEUTRAL_DARK } },

  { id: 'str-source', type: 'pattern', position: { x: COL4, y: 50 }, data: { label: 'Source', bg: TEAL, border: TEAL_DARK } },
  { id: 'str-consumer', type: 'pattern', position: { x: COL4, y: 210 }, data: { label: 'Consumer', bg: NEUTRAL, border: NEUTRAL_DARK } },
];

const edges = [
  // Topic: down
  { id: 'e-t1', source: 'topic-pub', target: 'topic-sub1', sourceHandle: 'bot-src', targetHandle: 'top-tgt', type: 'smoothstep', animated: true, style: { stroke: TEAL, strokeWidth: 2 }, markerEnd: arrow(TEAL) },
  { id: 'e-t2', source: 'topic-pub', target: 'topic-sub2', sourceHandle: 'bot-src', targetHandle: 'top-tgt', type: 'smoothstep', animated: true, style: { stroke: TEAL, strokeWidth: 2 }, markerEnd: arrow(TEAL) },

  // Service: request down, response up (offset right/left to avoid overlap)
  { id: 'e-s-req', source: 'svc-client', target: 'svc-server', sourceHandle: 'bot-src', targetHandle: 'top-tgt', type: 'smoothstep', animated: true, label: 'request', labelStyle: { fontSize: 10, fill: '#aaa' }, style: { stroke: AMBER, strokeWidth: 2 }, markerEnd: arrow(AMBER) },
  { id: 'e-s-res', source: 'svc-server', target: 'svc-client', sourceHandle: 'top-src', targetHandle: 'bot-tgt', type: 'smoothstep', animated: true, label: 'response', labelStyle: { fontSize: 10, fill: '#aaa' }, style: { stroke: TEAL, strokeWidth: 2 }, markerEnd: arrow(TEAL) },

  // Action: goal down, feedback + result up
  { id: 'e-a-goal', source: 'act-client', target: 'act-server', sourceHandle: 'bot-src', targetHandle: 'top-tgt', type: 'smoothstep', animated: true, label: 'goal', labelStyle: { fontSize: 10, fill: '#aaa' }, style: { stroke: AMBER, strokeWidth: 2 }, markerEnd: arrow(AMBER) },
  { id: 'e-a-fb', source: 'act-server', target: 'act-client', sourceHandle: 'left-src', targetHandle: 'left-tgt', type: 'smoothstep', animated: true, label: 'feedback', labelStyle: { fontSize: 10, fill: '#aaa' }, style: { stroke: TEAL, strokeWidth: 1.5, strokeDasharray: '4 4' }, markerEnd: arrow(TEAL) },
  { id: 'e-a-res', source: 'act-server', target: 'act-client', sourceHandle: 'right-src', targetHandle: 'right-tgt', type: 'smoothstep', animated: true, label: 'result', labelStyle: { fontSize: 10, fill: '#aaa' }, style: { stroke: INDIGO, strokeWidth: 2 }, markerEnd: arrow(INDIGO) },

  // Streaming: thick
  { id: 'e-str', source: 'str-source', target: 'str-consumer', sourceHandle: 'bot-src', targetHandle: 'top-tgt', type: 'smoothstep', animated: true, style: { stroke: TEAL, strokeWidth: 4 }, markerEnd: arrow(TEAL) },
];

export default function PipelineFlow() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ height: 420, display: 'grid', placeItems: 'center', color: '#5A5A7A' }}>Loading...</div>;

  return (
    <div style={{ height: 420, width: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
        panOnDrag={false} zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false}
        preventScrolling={false} proOptions={{ hideAttribution: true }} style={{ background: 'transparent' }}>
        <Background color="rgba(0, 212, 170, 0.04)" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
