import React, { useEffect, useRef, useState } from 'react';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandAlt } from '@fortawesome/free-solid-svg-icons';

import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/css-hint';
import 'codemirror/addon/hint/html-hint';
import 'codemirror/addon/hint/xml-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/lint/lint';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';

import './style.css';
import CodeMirror from 'codemirror';

type EditorProps = {
  displayName: string;
  language: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

function Editor({ displayName, language, value, onChange }: EditorProps) {
  const [open, setOpen] = useState(true);

  const titleRef = useRef<HTMLDivElement>(null);

  function titleClickEventHandler() {
    if (!open) {
      setOpen(true);
    }
  }

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.addEventListener('click', titleClickEventHandler);
    }

    return () => {
      titleRef.current?.removeEventListener('click', titleClickEventHandler);
    };
  }, [open]);

  function handleChange(currentValue: string) {
    onChange(currentValue);
  }

  function isValidKey(keyCode: number) {
    const input = String.fromCharCode(keyCode);
    const regex = /[a-zA-Z0-9-_ ]/;

    return regex.test(input);
  }

  const handleKeydown = (editor: CodeMirror.Editor, event: KeyboardEvent) => {
    if (!editor.state.completionActive && isValidKey(event.keyCode)) {
      editor.showHint({ completeSingle: false });
    }
  };

  return (
    <div className={`editor-container ${open ? '' : 'collapsed'}`}>
      <div className={`editor-title ${open ? '' : 'collapsed'}`} ref={titleRef}>
        {displayName}
        <button
          type="button"
          className="expand-collapse-btn"
          onClick={() => setOpen(prevOpen => !prevOpen)}
        >
          <FontAwesomeIcon icon={faExpandAlt} size="lg" />
        </button>
      </div>
      <ControlledEditor
        onBeforeChange={(_editor, _data, currentValue) =>
          handleChange(currentValue)
        }
        value={value}
        className="code-mirror-wrapper"
        options={{
          lineWrapping: true,
          mode: language,
          extraKeys: { 'Ctrl-Space': 'autocomplete' },
          matchBrackets: true,
          autoCloseBrackets: true,
          autoCloseTags: true,
          lint: true,
          theme: 'material',
          lineNumbers: true,
        }}
        onKeyDown={handleKeydown}
      />
    </div>
  );
}

export default Editor;
