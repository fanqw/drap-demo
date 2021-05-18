import React from 'react';

import './index.css';

export default class Demo extends React.PureComponent {
  render() {
    return (
      <div>
        <div className='demo'>更多</div>
        <div className='menu'>
          <div className='menuI' key='1'>
            菜单一
          </div>
          <div className='menuI' key='2'>
            菜单二
          </div>
          <div className='menuI' key='3'>
            菜单三
          </div>
        </div>
      </div>
    );
  }
}
