const fs = require('fs');
const html = fs.readFileSync('c:/Users/HP/Downloads/syncspace-whiteboard/syncspace-whiteboard.html', 'utf8');

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  fs.writeFileSync('./frontend/client/src/components/SyncSpaceWhiteboard.css', styleMatch[1].trim());
  console.log('Created CSS file');
}

const bodyMatch = html.match(/<body>([\s\S]*?)<script src=/);
if (!bodyMatch) {
  console.log('Could not match body');
  process.exit(1);
}

let uiHtml = bodyMatch[1].trim();
uiHtml = uiHtml.replace(/<div class="toast" id="toast"><\/div>/, ''); // handle toast separately or keep it
// Convert to JSX
uiHtml = uiHtml.replace(/class=/g, 'className=');
uiHtml = uiHtml.replace(/<!--[\s\S]*?-->/g, ''); // remove comments
uiHtml = uiHtml.replace(/style="(.*?)"/g, (match, styleStr) => {
  const styles = styleStr.split(';').filter(s => s.trim()).reduce((acc, curr) => {
    const parts = curr.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();
      const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
      acc[camelKey] = value;
    }
    return acc;
  }, {});
  return 'style={' + JSON.stringify(styles) + '}';
});
// Self closing tags
uiHtml = uiHtml.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
// stroke-width to strokeWidth
uiHtml = uiHtml.replace(/stroke-width/g, 'strokeWidth');
uiHtml = uiHtml.replace(/stroke-linecap/g, 'strokeLinecap');
uiHtml = uiHtml.replace(/stroke-linejoin/g, 'strokeLinejoin');

const scriptMatch = html.match(/<script>\s*([\s\S]*?)<\/script>\s*<\/body>/);
let jsCode = scriptMatch ? scriptMatch[1] : '';

// Wrap in try catch and handle variables
jsCode = jsCode.replace(/const ICONS = /g, 'window.__ICONS = ');
jsCode = jsCode.replace(/const TOOLS = /g, 'window.__TOOLS = ');

const tsxCode = `import React, { useEffect, useRef } from 'react';
import './SyncSpaceWhiteboard.css';

// Ensure Konva is loaded globally in index.html or we dynamically load it
export function SyncSpaceWhiteboard() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Konva if not present
    if (!(window as any).Konva) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/konva/9.3.6/konva.min.js';
      script.async = false;
      document.head.appendChild(script);
    }
    
    // The Monaco script is loaded in the original HTML, so we load it here too
    if (!(window as any).require) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.js';
      script.async = false;
      document.head.appendChild(script);
    }

    // Give scripts a moment to load before initializing
    const timer = setTimeout(() => {
      initApp();
    }, 500);

    let stageInstance: any = null;
    let editorInstance: any = null;

    function initApp() {
      if (!containerRef.current) return;
      if (!(window as any).Konva || !(window as any).require) {
        setTimeout(initApp, 100);
        return;
      }
      
      try {
        ${jsCode.replace(/\n/g, '\n        ')}
        stageInstance = typeof stage !== 'undefined' ? stage : null;
        if (typeof monacoEditor !== 'undefined') {
          editorInstance = monacoEditor;
        }
      } catch (err) {
        console.error('Error initializing whiteboard', err);
      }
    }

    return () => {
      clearTimeout(timer);
      if (stageInstance) stageInstance.destroy();
      if (editorInstance) editorInstance.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="syncspace-whiteboard-wrapper h-full w-full relative">
      ${uiHtml}
      <div className="toast" id="toast"></div>
    </div>
  );
}
`;

fs.writeFileSync('./frontend/client/src/components/SyncSpaceWhiteboard.tsx', tsxCode);
console.log('Created TSX file');
