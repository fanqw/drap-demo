import React, { PureComponent } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

import './index.css';
const ResponsiveGridLayout = WidthProvider(Responsive);

const colsMap = { lg: 2, md: 2, sm: 2, xs: 2, xxs: 2 };

class Demo extends PureComponent {
  state = {
    layouts: {
      lg: [],
      md: [],
      sm: [],
      xs: [],
      xxs: [],
    }, // 布局信息
    mode: 'edit', // 'edit' | 'preview'
    compactType: 'horizontal', // 'horizontal' | 'vertical'
    breakpoint: 'lg',
  };

  handleClick = () => {
    const { layouts, breakpoint } = this.state;
    // 当前的layout数据
    const currentBreakpointLayout = layouts[breakpoint];
    // 当前的cols
    const currentCols = colsMap[breakpoint];
    // 新增card 的 x
    const x = currentBreakpointLayout.length % currentCols;
    // 新增card 的 y
    const y = Number.parseInt(currentBreakpointLayout.length / currentCols);
    console.log('x,y', x, y);
    // 新的layout数据
    const newBreakpointLayout = currentBreakpointLayout.concat([
      {
        i: new Date().getMilliseconds().toString(),
        x,
        y,
        w: 1,
        h: 1,
        isDraggable: true,
        isResizable: false,
      },
    ]);
    // 新的 layouts 数据
    const newLayouts = {
      ...layouts,
      [breakpoint]: this.handleBreakpointLayoutSort(newBreakpointLayout),
    };
    this.setState({
      layouts: newLayouts,
    });
  };

  // 将layout内的数据按照大小排序
  handleBreakpointLayoutSort = (breakpointLayout) => breakpointLayout.sort((a, b) => a.y - b.y || a.x - b.x);

  handleLayoutChange = (c, currentAllLayouts) => {
    const { breakpoint } = this.state;
    console.log('handleLayoutChange', c);
    // console.log('触发===》handleLayoutChange', currentLayout, allLayouts);
    // 布局调整后，当前断点的layouts
    const currentBreakpointLayout = currentAllLayouts[breakpoint];
    const newLayouts = {
      ...currentAllLayouts,
      [breakpoint]: this.handleBreakpointLayoutSort(currentBreakpointLayout),
    };
    this.setState({
      layouts: newLayouts,
    });
  };

  handleBreakpointChange = (currentBreakpoint, currentCols) => {
    console.log('handleBreakpointChange');
    const { layouts, breakpoint } = this.state;
    // 上一个 breakpoint 的 layout
    const preBreakpointLayout = layouts[breakpoint];
    const preCols = colsMap[breakpoint];
    let currentBreakpointLayout = preBreakpointLayout;
    if (preCols !== currentCols) {
      currentBreakpointLayout = preBreakpointLayout.map((item, index) => {
        // const length = index;
        const x = index % currentCols;
        const y = Number.parseInt(index / currentCols);
        return {
          ...item,
          x,
          y,
        };
      });
    }
    const newLayouts = {
      ...layouts,
      [currentBreakpoint]: currentBreakpointLayout,
    };
    this.setState({
      layouts: newLayouts,
      breakpoint: currentBreakpoint,
    });
  };

  render() {
    const { layouts, breakpoint, mode, compactType } = this.state;
    // console.log('layouts', breakpoint, layouts);
    return (
      <div>
        <button onClick={this.handleClick}>新增</button>
        <button onClick={() => this.setState({ mode: mode === 'edit' ? 'preview' : 'edit' })}>
          {compactType === 'edit' ? '切换不可拖拽' : '切换可拖拽'}
        </button>
        <button onClick={() => this.setState({ compactType: compactType === 'vertical' ? 'horizontal' : 'vertical' })}>
          {compactType === 'vertical' ? '切换为水平' : '切换为垂直'}
        </button>
        <div className='container'>
          <ResponsiveGridLayout
            className='layouts'
            // layouts={layouts}
            cols={colsMap}
            rowHeight={100}
            onLayoutChange={this.handleLayoutChange}
            // resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
            // resizeHandles={['s']}
            onBreakpointChange={this.handleBreakpointChange}
            compactType={compactType}
          >
            {layouts[breakpoint].map(({ i, x, y }) => (
              <div key={i} className='layout-grid-item'>
                <span className='text'>{i}</span>
                <br />
                <span className='text'>
                  {x}, {y}
                </span>
                <br />
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </div>
    );
  }
}

export default Demo;
