import React, { useEffect } from 'react';
import Canvas from './pixi-index';
import EditGraphics from './pixi-graphics';
import EditText from './pixi-text';


const Demo = () => {
  useEffect(() => {
    const canvasContainer = document.getElementById('canvas-container');
    const app = new Canvas();
    if (canvasContainer) {
      app.attach(canvasContainer);
    }
    return () => {
      canvasContainer && app.detach(canvasContainer);
    }
  }, []);
  
  return (
    <div>
      <div id="canvas-container" style={{ width: '100%', height: '100vh' }} />
    </div>
  )
}

export default Demo;