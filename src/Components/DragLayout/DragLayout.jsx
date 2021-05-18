import React, { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import _ from 'lodash';

import './DragLayout.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DragLayout = (props) => {
  const {
    children,
    cols,
    mode,
    layouts,
    onCreate = () => {},
    onRemove = () => {},
    onChange = () => {},
    ...otherProps
  } = props;

  const [dataSource, setDataSource] = useState({});
  const [breakpoint, setBreakpoint] = useState('lg');

  // useEffect(() => {
  //   if (mode === '1') {
  //     const newDataSource = {};
  //     for (const key in layouts) {
  //       if (Object.hasOwnProperty.call(layouts, key)) {
  //         const element = layouts[key] || [];
  //         newDataSource[key] = element.map((item) => ({
  //           ...item,
  //           isDraggable: false,
  //           isResizable: false,
  //           static: false,
  //         }));
  //       }
  //     }
  //     setDataSource(newDataSource);
  //   }
  //   if (mode === '2') {
  //     setDataSource(layouts);
  //   }
  // }, [mode]);

  // 按照现有布局，往第一个空位处，添加卡片
  const handleAdd = () => {
    // 当前的cols
    const currentBreakpointLayout = layouts[breakpoint] || [];
    const currentCols = cols[breakpoint];
    const x = currentBreakpointLayout.length % currentCols;
    const y = Number.parseInt(currentBreakpointLayout.length / currentCols);

    // 求X,Y算法
    // const len = layouts.length;

    // let X = 0;
    // let Y = 0;

    // if (len > 1) {
    //   const last = layouts[len - 1];
    //   const splitZ = ({ x, y, w, h }, _map) => {
    //     for (let startX = x; startX < x + w; startX++) {
    //       for (let startY = y; startY < y + h; startY++) {
    //         _map[`${startX}-${startY}`] = true;
    //       }
    //     }
    //   };

    //   const tMap = {};
    //   layouts.forEach((ele) => {
    //     if (ele.w > 1 || ele.h > 1) {
    //       splitZ(ele, tMap);
    //     } else {
    //       tMap[`${ele.x}-${ele.y}`] = true;
    //     }
    //   });

    //   let boo = false;
    //   for (let y = 0; y < last.y + 1; y++) {
    //     if (boo) break;
    //     for (let x = 0; x < currentCols; x++) {
    //       if (boo) break;
    //       if (!tMap[`${x}-${y}`]) {
    //         X = x;
    //         Y = y;
    //         boo = true;
    //       }
    //     }
    //   }
    //   console.log('tMap', tMap);
    // }

    // 新的layout数据
    const date = new Date();
    const ele = {
      i: `${date.getSeconds() * 1000 + date.getMilliseconds()}`,
      x,
      y,
      w: 1,
      h: 1,
      isDraggable: false,
      isResizable: false,
      static: false,
    };
    console.log('ele', ele);
    if (mode === '1') {
      onCreate(ele, breakpoint, layouts);
    }
  };

  // 将layout内的数据按照大小排序 (排序的目的是为了在，布局改变后，始终保持相同位置)
  const handleLayoutSort = (layout) => layout.sort((a, b) => a.y - b.y || a.x - b.x);

  const handleLayoutChange = (currentBreakpointLayout) => {
    // console.log('layoutChange');
    const newLayouts = handleLayoutSort(currentBreakpointLayout);
    onChange({
      ...layouts,
      [breakpoint]: newLayouts,
    });
  };

  // 在breakpoint 改变后 重新布局
  const handleBreakpointChange = (currentBreakpoint, currentCols) => {
    let currentBreakpointLayout = layouts[currentBreakpoint] || [];
    const preBreakpointLayout = layouts[breakpoint] || [];
    const preCols = cols[breakpoint];

    // 该布局下 无数据
    if (currentBreakpointLayout.length === 0) {
      if (preCols === currentCols) {
        currentBreakpointLayout = preBreakpointLayout;
      } else {
        currentBreakpointLayout = preBreakpointLayout.map((item, index) => {
          const x = index % currentCols;
          const y = Number.parseInt(index / currentCols);
          return {
            ...item,
            isDraggable: false,
            isResizable: false,
            static: false,
            // x: 0,
            // y: 0,
            x,
            y,
          };
        });
      }
    }

    setBreakpoint(currentBreakpoint);
    onChange({
      ...layouts,
      [currentBreakpoint]: handleLayoutSort(currentBreakpointLayout),
    });
  };

  // 对数据进行深拷贝，否则新增的卡片排列方式有问题
  // const _dataSource = _.cloneDeep(dataSource);
  // const dataSource = layouts;
  // console.log('===>dataSource', dataSource);

  const newDataSource = layouts;

  // 预览模式下屏蔽所有操作项
  if (mode === '2') {
    console.log('++++++++++++++++++++');
    for (const key in layouts) {
      if (Object.hasOwnProperty.call(layouts, key)) {
        const element = layouts[key] || [];
        newDataSource[key] = element.map((item) => ({
          ...item,
          isDraggable: false,
          isResizable: false,
          static: false,
        }));
      }
    }
  }

  // console.log('newDataSource', mode, newDataSource);
  return (
    <>
      {/* <button onClick={handleAdd}>新增</button> */}
      <ResponsiveGridLayout
        layouts={newDataSource}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={handleBreakpointChange}
        cols={cols}
        {...otherProps}
      >
        {Array.isArray(children) ? (
          children.map((child) => {
            // console.log('child', child);
            return (
              <div key={child.key}>
                {React.cloneElement(child, {
                  i: child.key,
                  mode,
                  breakpoint,
                  layouts,
                  onRemove,
                  onChange,
                })}
              </div>
            );
          })
        ) : (
          <div key='1' />
        )}
      </ResponsiveGridLayout>
    </>
  );
};

export default DragLayout;
