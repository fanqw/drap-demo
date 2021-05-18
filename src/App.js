import './App.css';
import { useEffect, useState } from 'react';
import { DragLayout, DragPanel } from './Components/DragLayout';
import { fixedLayout, resizeLayout, demoLayout } from './mock';

function App() {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const [mode, setMode] = useState('2'); // 1 编辑  2 预览
  const [layouts, setLayouts] = useState({});

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      changeType('1');
    }, 1000);
  }, []);

  const changeType = (type) => {
    setType(type);
    // 使用storage存储数据
    let key = null;
    switch (type) {
      case '1':
        key = 'fixedLayout';
        break;
      case '2':
        key = 'resizeLayout';
        break;
      case '3':
        key = 'demoLayout';
        break;
      default:
        break;
    }

    const value = localStorage.getItem(key) || '{}';
    setLayouts(JSON.parse(value));

    // // 使用mock数据
    // if (type === '1') {
    //   setLayouts(fixedLayout);
    // }
    // if (type === '2') {
    //   setLayouts(resizeLayout);
    // }
    // if (type === '3') {
    //   setLayouts(demoLayout);
    // }
  };

  // 新增
  const onCreate = (item, breakpoint, allLayouts) => {
    const currentLayouts = allLayouts[breakpoint] || [];
    currentLayouts.push(item);
    // console.log('item', item);
    setLayouts({
      ...allLayouts,
      [breakpoint]: currentLayouts,
    });
  };

  // 移除
  const onRemove = (i) => {
    // console.log('val', val);
    const newLayouts = {};
    for (const key in layouts) {
      if (Object.hasOwnProperty.call(layouts, key)) {
        const element = layouts[key];
        const filter = element.filter((item) => item.i !== i);
        newLayouts[key] = filter;
      }
    }
    setLayouts(newLayouts);
  };

  const onChange = (val) => {
    // console.log('val', val);
    setLayouts(val);
  };

  const onSave = () => {
    let key = new Date().getTime();
    switch (type) {
      case '1':
        key = 'fixedLayout';
        break;
      case '2':
        key = 'resizeLayout';
        break;
      case '3':
        key = 'demoLayout';
        break;
      default:
        break;
    }
    localStorage.setItem(key, JSON.stringify(layouts));
  };

  const rowHeight = 200;
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };

  const commonProps = {
    breakpoints,
    rowHeight,
    layouts,
    mode,
    onChange,
    onRemove,
    onCreate,
    className: 'layouts',
  };

  const fixed = {
    ...commonProps,
    cols: { lg: 2, md: 2, sm: 2, xs: 2, xxs: 2 },
    compactType: 'vertical',
  };

  const resize = {
    ...commonProps,
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    compactType: 'horizontal',
  };

  const element = layouts?.lg || layouts?.md || layouts?.sm || layouts?.xs || layouts?.xxs || [];

  const dragLayoutProps = type === '1' ? fixed : resize;

  return (
    <div className='App'>
      <div className='menu'>
        <div>
          <button className={type === '1' ? 'active' : ''} onClick={() => changeType('1')}>
            固定布局
          </button>
          <button className={type === '2' ? 'active' : ''} onClick={() => changeType('2')}>
            自适应布局
          </button>
          <button className={type === '3' ? 'active' : ''} onClick={() => changeType('3')}>
            大屏demo
          </button>
        </div>
        <div>
          <button className={mode === '1' ? 'active' : ''} onClick={() => setMode('1')}>
            编辑
          </button>
          <button className={mode === '2' ? 'active' : ''} onClick={() => setMode('2')}>
            预览
          </button>
        </div>
      </div>
      <div className='container'>
        <DragLayout key={type} {...dragLayoutProps}>
          {element.map(({ i }) => (
            <DragPanel key={i}>
              <div>{i}</div>
            </DragPanel>
          ))}
        </DragLayout>
      </div>
      <button onClick={onSave} style={{ marginTop: '12px' }}>
        保存
      </button>
    </div>
  );
}

export default App;
