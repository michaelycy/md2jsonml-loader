import readme from './readme.md';
// import React from 'react';

if (process.env.NODE_ENV === 'production') {
  console.log('readme log: ', readme);
  const b = 12;
  console.log('b: ', b);
} else {
  console.log('readme log2: ', readme);
  const a = 12;
  console.log('a: ', a);
}
