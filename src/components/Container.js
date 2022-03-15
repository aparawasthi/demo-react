import React from 'react';
import Header from './Header';

function Container({children}) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default Container