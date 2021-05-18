import React, { useEffect, useState } from 'react';

import './DragPanel.css';

const DragPanel = (props) => {
  const { i, mode, breakpoint, layouts, onChange, onRemove, children } = props;
  const [isDraggable, setIsDraggable] = useState(false);
  const [isResizable, setIsResizable] = useState(false);
  const [isStatic, setIsStatic] = useState(false);

  useEffect(() => {
    const currentLayout = layouts[breakpoint] || [];
    const find = currentLayout.find((item) => item.i === i);
    console.log('=====>');
    if (find) {
      setIsDraggable(find.isDraggable);
      setIsResizable(find.isResizable);
      setIsStatic(find.static);
    }
  }, [breakpoint]);

  const drag = () => {
    if (isStatic) return;
    console.log('drag');
    const currentLayout = layouts[breakpoint];
    const newCurrentLayout = currentLayout.map((item) => {
      if (item.i === i) {
        return {
          ...item,
          isDraggable: !isDraggable,
        };
      }
      return item;
    });

    setIsDraggable(!isDraggable);

    onChange({
      ...layouts,
      [breakpoint]: newCurrentLayout,
    });
  };

  const resize = () => {
    if (isStatic) return;
    console.log('resize');
    const currentLayout = layouts[breakpoint];
    const newCurrentLayout = currentLayout.map((item) => {
      if (item.i === i) {
        return {
          ...item,
          isResizable: !isResizable,
        };
      }
      return item;
    });

    setIsResizable(!isResizable);

    onChange({
      ...layouts,
      [breakpoint]: newCurrentLayout,
    });
  };

  const fixed = () => {
    console.log('Static');
    const currentLayout = layouts[breakpoint];
    const newCurrentLayout = currentLayout.map((item) => {
      if (item.i === i) {
        return {
          ...item,
          static: !isStatic,
          isResizable: !isStatic ? false : isResizable,
          isDraggable: !isStatic ? false : isDraggable,
        };
      }
      return item;
    });

    setIsStatic(!isStatic);
    setIsDraggable(!isStatic ? false : isDraggable);
    setIsResizable(!isStatic ? false : isResizable);

    onChange({
      ...layouts,
      [breakpoint]: newCurrentLayout,
    });
  };

  const remove = () => {
    console.log('remove');
    onRemove(i);
  };

  const commonClass = 'actionItem iconfont';

  return (
    <div className={`dragPanel ${isDraggable ? 'dropping' : ''}`}>
      {mode === '1' && (
        <div className='action'>
          <div className={`${commonClass} icon-drag ${isDraggable ? 'active' : ''}`} onClick={drag} />
          <div className={`${commonClass} icon-resize ${isResizable ? 'active' : ''}`} onClick={resize} />
          <div className={`${commonClass} icon-fix ${isStatic ? 'active' : ''}`} onClick={fixed} />
          {/* <div className={`${commonClass} icon-delete`} /> */}
          {/* <button key='1' onClick={drag}>
            拖拽
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button key='2' onClick={resize}>
            长宽
          </button>
          <button key='3' onClick={fixed}>
            固定
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button key='4' onClick={remove}>
            删除
          </button> */}
        </div>
      )}
      {children}
    </div>
  );
};

export default DragPanel;
