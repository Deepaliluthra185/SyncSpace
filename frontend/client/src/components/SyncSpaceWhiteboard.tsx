import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Ellipse, Line, Text, Transformer } from 'react-konva';
import Editor, { useMonaco } from '@monaco-editor/react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { useParams } from 'wouter';
import { MousePointer2, Square, Circle, Pen, Type, Eraser, Play, Terminal, Loader2 } from 'lucide-react';
import './SyncSpaceWhiteboard.css';

type ShapeType = 'rect' | 'ellipse' | 'pen' | 'text' | 'eraser';

interface BaseShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  stroke: string;
  strokeWidth: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
}

interface RectShape extends BaseShape {
  type: 'rect';
  width: number;
  height: number;
  fill?: string;
}

interface EllipseShape extends BaseShape {
  type: 'ellipse';
  radiusX: number;
  radiusY: number;
  fill?: string;
}

interface PenShape extends BaseShape {
  type: 'pen' | 'eraser';
  points: number[];
}

interface TextShape extends BaseShape {
  type: 'text';
  text: string;
  fontSize: number;
}

type Shape = RectShape | EllipseShape | PenShape | TextShape;

const COLORS = ['#191c20', '#e03131', '#2f9e44', '#1971c2', '#f08c00', '#9c36b5', '#ffffff'];

export function SyncSpaceWhiteboard() {
  const { roomId } = useParams<{ roomId: string }>();
  
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [tool, setTool] = useState<ShapeType | 'select'>('select');
  const [strokeColor, setStrokeColor] = useState(COLORS[0]);
  const [language, setLanguage] = useState('python');
  const [selectedId, selectShape] = useState<string | null>(null);

  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const stageRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  
  // Yjs Refs
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const shapesMapRef = useRef<Y.Map<Shape> | null>(null);
  const codeTextRef = useRef<Y.Text | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const editorRef = useRef<any>(null);

  // Resize handler
  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Initialize Yjs
  useEffect(() => {
    if (!roomId) return;
    const doc = new Y.Doc();
    ydocRef.current = doc;

    const wsUrl = window.location.hostname === 'localhost' ? 'ws://localhost:5000' : `wss://${window.location.host}`;
    
    const provider = new WebsocketProvider(wsUrl, roomId, doc);
    providerRef.current = provider;

    const shapesMap = doc.getMap<Shape>('shapes');
    shapesMapRef.current = shapesMap;

    codeTextRef.current = doc.getText('code');

    shapesMap.observe(() => {
      const updatedShapes = Array.from(shapesMap.values());
      setShapes(updatedShapes);
    });

    setShapes(Array.from(shapesMap.values()));

    return () => {
      bindingRef.current?.destroy();
      provider.disconnect();
      doc.destroy();
    };
  }, [roomId]);

  // Handle Editor Mount
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    if (codeTextRef.current && providerRef.current?.awareness) {
      bindingRef.current = new MonacoBinding(
        codeTextRef.current,
        editor.getModel(),
        new Set([editor]),
        providerRef.current.awareness
      );
    }
  };

  const handleRunCode = async () => {
    if (!editorRef.current) return;
    const code = editorRef.current.getValue();
    if (!code.trim()) return;

    setIsExecuting(true);
    setTerminalOutput('Running...');

    try {
      let pistonLanguage = language;
      if (language === 'javascript') pistonLanguage = 'js';

      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: pistonLanguage,
          version: '*',
          files: [
            {
              content: code,
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.run) {
        setTerminalOutput(data.run.output || 'Execution finished with no output.');
      } else {
        setTerminalOutput(`Error: ${data.message || 'Failed to execute code'}`);
      }
    } catch (err) {
      setTerminalOutput(`Failed to execute code: ${err}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Drawing State
  const [isDrawing, setIsDrawing] = useState(false);
  const [newShape, setNewShape] = useState<Shape | null>(null);

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleMouseDown = (e: any) => {
    if (tool === 'select') {
      checkDeselect(e);
      return;
    }

    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;
    
    const id = Date.now().toString(); // unique id
    setIsDrawing(true);
    selectShape(null);

    if (tool === 'pen' || tool === 'eraser') {
      setNewShape({
        id, type: tool, x: 0, y: 0, stroke: tool === 'eraser' ? '#000000' : strokeColor, strokeWidth: tool === 'eraser' ? 20 : 3, points: [pos.x, pos.y]
      });
    } else if (tool === 'rect') {
      setNewShape({
        id, type: 'rect', x: pos.x, y: pos.y, width: 0, height: 0, stroke: strokeColor, strokeWidth: 3, fill: 'transparent'
      });
    } else if (tool === 'ellipse') {
      setNewShape({
        id, type: 'ellipse', x: pos.x, y: pos.y, radiusX: 0, radiusY: 0, stroke: strokeColor, strokeWidth: 3, fill: 'transparent'
      });
    } else if (tool === 'text') {
      const textShape: TextShape = {
        id, type: 'text', x: pos.x, y: pos.y, text: 'Text', fontSize: 20, stroke: strokeColor, strokeWidth: 1
      };
      if (shapesMapRef.current) {
        shapesMapRef.current.set(id, textShape);
      }
      setIsDrawing(false);
      setTool('select');
      selectShape(id);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !newShape) return;
    
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    if (newShape.type === 'pen' || newShape.type === 'eraser') {
      setNewShape({
        ...newShape,
        points: [...(newShape as PenShape).points, pos.x, pos.y]
      });
    } else if (newShape.type === 'rect') {
      const rect = newShape as RectShape;
      setNewShape({
        ...rect,
        width: pos.x - rect.x,
        height: pos.y - rect.y,
      });
    } else if (newShape.type === 'ellipse') {
      const ellipse = newShape as EllipseShape;
      setNewShape({
        ...ellipse,
        radiusX: Math.abs(pos.x - ellipse.x),
        radiusY: Math.abs(pos.y - ellipse.y),
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (newShape && shapesMapRef.current) {
      shapesMapRef.current.set(newShape.id, newShape);
    }
    setNewShape(null);
  };

  const handleTransformEnd = (e: any, shapeId: string) => {
    const node = e.target;
    if (shapesMapRef.current) {
      const shape = shapesMapRef.current.get(shapeId);
      if (shape) {
        const updated = {
          ...shape,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY()
        };
        shapesMapRef.current.set(shapeId, updated);
      }
    }
  };

  const handleDragEnd = (e: any, shapeId: string) => {
    const node = e.target;
    if (shapesMapRef.current) {
      const shape = shapesMapRef.current.get(shapeId);
      if (shape) {
        const updated = {
          ...shape,
          x: node.x(),
          y: node.y(),
        };
        shapesMapRef.current.set(shapeId, updated);
      }
    }
  };

  useEffect(() => {
    if (selectedId && trRef.current && tool === 'select') {
      const node = layerRef.current.findOne(`#${selectedId}`);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer().batchDraw();
      }
    } else if (trRef.current) {
      trRef.current.nodes([]);
    }
  }, [selectedId, tool, shapes]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        if (shapesMapRef.current) {
          shapesMapRef.current.delete(selectedId);
          selectShape(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  return (
    <div className="flex h-full w-full bg-surface-lowest">
      {/* Left Panel: Whiteboard */}
      <div className="flex-1 flex flex-col relative border-r border-subtle" ref={containerRef}>
        {/* Toolbar */}
        <div className="absolute top-4 left-4 z-10 flex items-center bg-surface border border-subtle rounded-md shadow-md p-1 gap-1">
          <button className={`p-2 rounded hover:bg-surface-mid ${tool === 'select' ? 'bg-surface-high text-primary' : ''}`} onClick={() => setTool('select')} title="Select"><MousePointer2 size={18} /></button>
          <button className={`p-2 rounded hover:bg-surface-mid ${tool === 'pen' ? 'bg-surface-high text-primary' : ''}`} onClick={() => setTool('pen')} title="Pen"><Pen size={18} /></button>
          <button className={`p-2 rounded hover:bg-surface-mid ${tool === 'rect' ? 'bg-surface-high text-primary' : ''}`} onClick={() => setTool('rect')} title="Rectangle"><Square size={18} /></button>
          <button className={`p-2 rounded hover:bg-surface-mid ${tool === 'ellipse' ? 'bg-surface-high text-primary' : ''}`} onClick={() => setTool('ellipse')} title="Circle"><Circle size={18} /></button>
          <button className={`p-2 rounded hover:bg-surface-mid ${tool === 'text' ? 'bg-surface-high text-primary' : ''}`} onClick={() => setTool('text')} title="Text"><Type size={18} /></button>
          <button className={`p-2 rounded hover:bg-surface-mid ${tool === 'eraser' ? 'bg-surface-high text-primary' : ''}`} onClick={() => setTool('eraser')} title="Eraser"><Eraser size={18} /></button>
          <div className="w-[1px] h-6 bg-subtle mx-1"></div>
          <div className="flex items-center gap-1 px-1">
            {COLORS.map(c => (
              <button key={c} className={`w-5 h-5 rounded-full border border-subtle cursor-pointer ${strokeColor === c ? 'ring-2 ring-primary ring-offset-1 ring-offset-surface' : ''}`} style={{ backgroundColor: c }} onClick={() => setStrokeColor(c)} />
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 w-full h-full overflow-hidden">
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            ref={stageRef}
          >
            <Layer ref={layerRef}>
              {shapes.map((shape) => {
                const commonProps = {
                  id: shape.id,
                  x: shape.x,
                  y: shape.y,
                  stroke: shape.stroke,
                  strokeWidth: shape.strokeWidth,
                  rotation: shape.rotation || 0,
                  scaleX: shape.scaleX || 1,
                  scaleY: shape.scaleY || 1,
                  draggable: tool === 'select',
                  onClick: () => { if (tool === 'select') selectShape(shape.id); },
                  onTap: () => { if (tool === 'select') selectShape(shape.id); },
                  onDragEnd: (e: any) => handleDragEnd(e, shape.id),
                  onTransformEnd: (e: any) => handleTransformEnd(e, shape.id),
                };

                if (shape.type === 'rect') {
                  return <Rect key={shape.id} {...commonProps} width={(shape as RectShape).width} height={(shape as RectShape).height} fill={(shape as RectShape).fill} />;
                }
                if (shape.type === 'ellipse') {
                  return <Ellipse key={shape.id} {...commonProps} radiusX={(shape as EllipseShape).radiusX} radiusY={(shape as EllipseShape).radiusY} fill={(shape as EllipseShape).fill} />;
                }
                if (shape.type === 'pen' || shape.type === 'eraser') {
                  return <Line key={shape.id} {...commonProps} points={(shape as PenShape).points} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation={shape.type === 'eraser' ? 'destination-out' : 'source-over'} />;
                }
                if (shape.type === 'text') {
                  return <Text key={shape.id} {...commonProps} text={(shape as TextShape).text} fontSize={(shape as TextShape).fontSize} fontFamily="Inter" padding={4} />;
                }
                return null;
              })}
              
              {/* Draw new shape preview */}
              {newShape && (
                <>
                  {newShape.type === 'rect' && <Rect x={newShape.x} y={newShape.y} width={(newShape as RectShape).width} height={(newShape as RectShape).height} stroke={newShape.stroke} strokeWidth={newShape.strokeWidth} />}
                  {newShape.type === 'ellipse' && <Ellipse x={newShape.x} y={newShape.y} radiusX={(newShape as EllipseShape).radiusX} radiusY={(newShape as EllipseShape).radiusY} stroke={newShape.stroke} strokeWidth={newShape.strokeWidth} />}
                  {(newShape.type === 'pen' || newShape.type === 'eraser') && <Line points={(newShape as PenShape).points} stroke={newShape.stroke} strokeWidth={newShape.strokeWidth} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation={newShape.type === 'eraser' ? 'destination-out' : 'source-over'} />}
                </>
              )}

              {tool === 'select' && <Transformer ref={trRef} boundBoxFunc={(oldBox, newBox) => newBox.width < 5 || newBox.height < 5 ? oldBox : newBox} />}
            </Layer>
          </Stage>
        </div>
      </div>

      {/* Right Panel: Code Editor */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Editor Toolbar */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <select
            className="bg-surface border border-subtle rounded px-2 py-1 text-sm outline-none text-on-surface"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="json">JSON</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
          <button 
            className="flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
            onClick={handleRunCode}
            disabled={isExecuting}
          >
            {isExecuting ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            Run
          </button>
        </div>

        <div className="flex-1 pt-14 flex flex-col">
          <div className="flex-1 min-h-[50%]">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                padding: { top: 16 },
                fontSize: 14,
              }}
            />
          </div>
          
          {/* Terminal Pane */}
          <div className="h-64 border-t border-subtle bg-[#1e1e1e] flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-subtle/50 text-xs font-mono text-muted-foreground uppercase tracking-wider">
              <Terminal size={14} /> Output
            </div>
            <div className="flex-1 overflow-auto p-4 text-sm font-mono text-gray-300 whitespace-pre-wrap">
              {terminalOutput || <span className="text-gray-600">Click "Run" to execute code...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
