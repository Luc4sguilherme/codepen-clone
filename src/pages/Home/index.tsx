import { useEffect, useRef, useState } from 'react';
import Editor from '../../components/Editor';
import useLocalStorage from '../../hooks/useLocalStorage';
import './style.css';

function Home() {
  const [html, setHtml] = useLocalStorage('html', '');
  const [js, setJs] = useLocalStorage('js', '');
  const [css, setCss] = useLocalStorage('css', '');
  const [srcDoc, setSrcDoc] = useState('');
  const [paneBottomHeight, setPaneBottomHeight] = useState('50%');
  const [editorDragCoverDisplay, setEditorDragCoverDisplay] = useState('none');
  const [paneBottomDisplay, setPaneBottomDisplay] = useState('flex');

  const paneBottomRef = useRef<HTMLDivElement>(null);
  const paneTopRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const editorDragCoverRef = useRef<HTMLDivElement>(null);

  function onMouseMove(e: MouseEvent) {
    e.preventDefault();

    const ressize = resizerRef.current;

    if (ressize) {
      if (
        e.clientY > window.innerHeight - ressize.offsetHeight ||
        e.clientY < 200
      ) {
        return;
      }

      setPaneBottomHeight(`${window.innerHeight - e.pageY}px`);
    }
  }

  function onMouseUp() {
    document.body.removeEventListener('mousemove', onMouseMove);
    document.body.removeEventListener('mouseup', onMouseUp);

    setPaneBottomDisplay('flex');
    setEditorDragCoverDisplay('none');
  }

  function onMouseDown() {
    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseleave', onMouseUp);

    setPaneBottomDisplay('block');
    setEditorDragCoverDisplay('block');
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
      <html>
        <body>${html}</body>
        <style>${css}</style>
        <script>${js}</script>
      </html>
    `);
    }, 250);

    return () => {
      clearTimeout(timeout);
    };
  }, [html, css, js]);

  useEffect(() => {
    if (paneBottomRef.current) {
      if (resizerRef.current) {
        resizerRef.current.addEventListener('mousedown', onMouseDown);
      }
    }

    return () => {
      if (resizerRef.current) {
        resizerRef.current.removeEventListener('mousedown', onMouseDown);
      }
    };
  }, []);

  return (
    <>
      <div className="pane top-pane" ref={paneTopRef}>
        <Editor
          language="xml"
          displayName="HTML"
          onChange={setHtml}
          value={html}
        />
        <Editor
          language="css"
          displayName="CSS"
          onChange={setCss}
          value={css}
        />
        <Editor
          language="javascript"
          displayName="JS"
          onChange={setJs}
          value={js}
        />
      </div>
      <div
        className="editor-drag-cover"
        ref={editorDragCoverRef}
        style={{ display: editorDragCoverDisplay }}
      />
      <div
        className="pane bottom-pane"
        ref={paneBottomRef}
        style={{ height: paneBottomHeight, display: paneBottomDisplay }}
      >
        <div className="resizer" ref={resizerRef} />
        <iframe
          srcDoc={srcDoc}
          title="output"
          sandbox="allow-scripts"
          frameBorder="0"
          width="100%"
          height="100%"
        />
      </div>
    </>
  );
}

export default Home;
