import React, { useEffect, useRef } from 'react';

interface NetworkBackgroundProps {
  intensity?: 'subtle' | 'vibrant';
  lightingEffect?: boolean;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
}

interface Packet {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

export const NetworkBackground: React.FC<NetworkBackgroundProps> = ({
  intensity = 'subtle',
  lightingEffect = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create interconnected network nodes
    const nodeCount = Math.min(32, Math.floor((width * height) / 38000));
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 2,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Traveling light packets across connections
    const packets: Packet[] = [];
    const maxPackets = 12;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Ambient God-Rays / Sunbeam Lighting Effect
      if (lightingEffect) {
        const rayGrad = ctx.createRadialGradient(
          width * 0.75,
          height * 0.15,
          10,
          width * 0.75,
          height * 0.15,
          width * 0.8
        );
        rayGrad.addColorStop(0, 'rgba(255, 235, 180, 0.08)');
        rayGrad.addColorStop(0.35, 'rgba(49, 152, 133, 0.06)');
        rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = rayGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += 0.03;

        // Bounce bounds gently
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw node glow
        const glow = Math.sin(node.pulsePhase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * (1 + glow * 0.25), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${intensity === 'vibrant' ? 0.35 : 0.22})`;
        ctx.fill();

        // Node center
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235, 255, 248, ${0.7 + glow * 0.3})`;
        ctx.fill();
      }

      // 3. Draw connecting network links
      const connectionDist = Math.min(width, height) * 0.32;
      const validPairs: [number, number][] = [];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * (intensity === 'vibrant' ? 0.24 : 0.14);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(215, 255, 245, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            validPairs.push([i, j]);
          }
        }
      }

      // 4. Spawn & Animate Traveling Light Pulses (Fiber Optic Data Packets)
      if (validPairs.length > 0 && packets.length < maxPackets && Math.random() < 0.08) {
        const pair = validPairs[Math.floor(Math.random() * validPairs.length)];
        packets.push({
          fromNode: pair[0],
          toNode: pair[1],
          progress: 0,
          speed: Math.random() * 0.015 + 0.008,
        });
      }

      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const n1 = nodes[pkt.fromNode];
        const n2 = nodes[pkt.toNode];
        if (!n1 || !n2) {
          packets.splice(p, 1);
          continue;
        }

        const px = n1.x + (n2.x - n1.x) * pkt.progress;
        const py = n1.y + (n2.y - n1.y) * pkt.progress;

        // Glowing light packet
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#5eead4';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, lightingEffect]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
