import React from 'react';
import { twinDotTest } from '../utils';
import './styles/base.css';
// 忽略依赖
import Button from '@shuyun-ep-team/kylin-ui/es/button';
import { Affix } from '@shuyun-ep-team/kylin-ui';
import { dotTest } from '.';

export default () => {
  dotTest();
  twinDotTest();
  return (
    <a>
      <Affix>affix</Affix>
      <Button>确认</Button>
    </a>
  );
};
