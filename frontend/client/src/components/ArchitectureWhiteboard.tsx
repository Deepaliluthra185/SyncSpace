import { useEffect, useState } from "react";
import { Stage, Layer, Rect, Text, Path, Group } from "react-konva";

interface ArchitectureWhiteboardProps {
  roomId: string;
  onBroadcast?: (data: any) => void;
}

// Colors from tailwind config
const colors = {
  surfaceContainerHigh: "#222a3d",
  surfaceContainer: "#171f33",
  outlineVariant: "#464554",
  onSurface: "#dae2fd",
  onSurfaceVariant: "#c7c4d7",
  primary: "#c0c1ff",
  primaryAlpha: "rgba(192, 193, 255, 0.1)",
  secondary: "#4edea3",
  onSecondaryFixed: "#002113",
};

interface NodeBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  bg: string;
  border: string;
  title: string;
  subtitle?: string;
  shadow?: boolean;
}

const NodeBox = ({ x, y, width, height, bg, border, title, subtitle, shadow }: NodeBoxProps) => (
  <Group x={x} y={y}>
    <Rect
      width={width}
      height={height}
      fill={bg}
      stroke={border}
      strokeWidth={1}
      cornerRadius={shadow ? 8 : 4}
      shadowColor={shadow ? colors.primary : "black"}
      shadowBlur={shadow ? 15 : 5}
      shadowOpacity={shadow ? 0.2 : 0.3}
      shadowOffsetY={3}
    />
    <Text
      text={title}
      x={0}
      y={subtitle ? height / 2 - 12 : height / 2 - 6}
      width={width}
      align="center"
      fill={border === colors.primary ? colors.primary : colors.onSurface}
      fontSize={12}
      fontFamily="JetBrains Mono"
      fontStyle="bold"
    />
    {subtitle && (
      <Text
        text={subtitle}
        x={0}
        y={height / 2 + 5}
        width={width}
        align="center"
        fill="rgba(192, 193, 255, 0.6)"
        fontSize={10}
        fontFamily="Geist"
      />
    )}
  </Group>
);

const AnimatedCursor = ({ x, y }: { x: number; y: number }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let angle = 0;
    let animationFrameId: number;

    const animate = () => {
      angle += 0.05;
      setOffset({
        x: Math.sin(angle) * 15,
        y: Math.cos(angle) * 15,
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <Group x={x + offset.x} y={y + offset.y}>
      <Path
        data="M 0 0 L 12 16 L 8 16 L 6 22 L 3 21 L 5 15 L 0 15 Z"
        fill={colors.secondary}
        rotation={-20}
      />
      <Group x={15} y={5}>
        <Rect width={150} height={20} fill={colors.secondary} cornerRadius={4} />
        <Text
          text="Alex Chen is drawing..."
          x={5}
          y={5}
          fill={colors.onSecondaryFixed}
          fontSize={10}
          fontFamily="JetBrains Mono"
          fontStyle="bold"
        />
      </Group>
    </Group>
  );
};

export function ArchitectureWhiteboard({ roomId, onBroadcast }: ArchitectureWhiteboardProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const checkSize = () => {
      const container = document.getElementById("canvas-container");
      if (container) {
        setDimensions({
          width: container.offsetWidth,
          height: container.offsetHeight,
        });
      }
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const centerX = dimensions.width / 2;
  const startY = 100;

  return (
    <section className="flex-1 border-r border-outline-variant bg-[#0f172a] flex flex-col relative overflow-hidden h-full">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 bg-surface-container border border-outline-variant p-1 rounded-lg">
        <button className="p-2 hover:bg-surface-container-high rounded bg-surface-container-highest text-primary">
          <span className="material-symbols-outlined">pan_tool</span>
        </button>
        <button className="p-2 hover:bg-surface-container-high rounded text-on-surface-variant">
          <span className="material-symbols-outlined">rectangle</span>
        </button>
        <button className="p-2 hover:bg-surface-container-high rounded text-on-surface-variant">
          <span className="material-symbols-outlined">circle</span>
        </button>
        <button className="p-2 hover:bg-surface-container-high rounded text-on-surface-variant">
          <span className="material-symbols-outlined">arrow_outward</span>
        </button>
        <button className="p-2 hover:bg-surface-container-high rounded text-on-surface-variant">
          <span className="material-symbols-outlined">text_fields</span>
        </button>
        <div className="h-px w-full bg-outline-variant my-1"></div>
        <button className="p-2 hover:bg-surface-container-high rounded text-on-surface-variant">
          <span className="material-symbols-outlined">palette</span>
        </button>
      </div>

      {/* Canvas Area */}
      <div
        id="canvas-container"
        className="flex-1 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] relative w-full h-full"
      >
        {dimensions.width > 0 && dimensions.height > 0 && (
          <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
              {/* Client to LB Arrow */}
              <Path
                data={`M ${centerX} ${startY + 40} L ${centerX} ${startY + 100}`}
                stroke={colors.primary}
                strokeWidth={1.5}
              />
              {/* Arrow Head */}
              <Path
                data={`M ${centerX - 5} ${startY + 95} L ${centerX} ${startY + 100} L ${centerX + 5} ${startY + 95}`}
                stroke={colors.primary}
                strokeWidth={1.5}
                fill="transparent"
              />

              {/* LB to Microservices Arrows */}
              <Path
                data={`M ${centerX} ${startY + 160} V ${startY + 180} H ${centerX - 150} V ${startY + 220}`}
                stroke={colors.primary}
                strokeWidth={1.5}
                fill="transparent"
              />
              <Path
                data={`M ${centerX} ${startY + 160} V ${startY + 220}`}
                stroke={colors.primary}
                strokeWidth={1.5}
                fill="transparent"
              />
              <Path
                data={`M ${centerX} ${startY + 160} V ${startY + 180} H ${centerX + 150} V ${startY + 220}`}
                stroke={colors.primary}
                strokeWidth={1.5}
                fill="transparent"
              />

              {/* Client Box */}
              <NodeBox
                x={centerX - 64}
                y={startY}
                width={128}
                height={40}
                bg={colors.surfaceContainerHigh}
                border={colors.outlineVariant}
                title="CLIENT"
              />

              {/* Load Balancer Box */}
              <NodeBox
                x={centerX - 96}
                y={startY + 100}
                width={192}
                height={60}
                bg={colors.primaryAlpha}
                border={colors.primary}
                title="LOAD BALANCER"
                subtitle="NGINX / AWS ALB"
                shadow={true}
              />

              {/* Microservices */}
              <NodeBox
                x={centerX - 150 - 56}
                y={startY + 220}
                width={112}
                height={40}
                bg={colors.surfaceContainer}
                border={colors.outlineVariant}
                title="AUTH SVC"
              />

              <NodeBox
                x={centerX - 56}
                y={startY + 220}
                width={112}
                height={40}
                bg={colors.surfaceContainer}
                border={colors.outlineVariant}
                title="USER SVC"
              />

              <NodeBox
                x={centerX + 150 - 56}
                y={startY + 220}
                width={112}
                height={40}
                bg={colors.surfaceContainer}
                border={colors.outlineVariant}
                title="ORDER SVC"
              />

              {/* Candidate Cursor near User Svc */}
              <AnimatedCursor x={centerX + 60} y={startY + 200} />
            </Layer>
          </Stage>
        )}
      </div>

      {/* Footer */}
      <div className="h-10 bg-surface-container-low border-t border-outline-variant px-4 flex items-center justify-between text-[11px] text-muted-foreground absolute bottom-0 left-0 right-0">
        <div className="flex gap-4">
          <span>Zoom: 100%</span>
          <span>Grid: 20px</span>
        </div>
        <span>Draft Saved 2s ago</span>
      </div>
    </section>
  );
}
