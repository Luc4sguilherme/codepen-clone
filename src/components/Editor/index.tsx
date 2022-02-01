import React, { useEffect, useRef, useState } from 'react';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandAlt } from '@fortawesome/free-solid-svg-icons';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';

import './style.css';

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
          theme: 'material',
          lineNumbers: true,
        }}
      />
    </div>
  );
}

export default Editor;
