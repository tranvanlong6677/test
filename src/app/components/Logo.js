import React from 'react';

const Logo = (props) => {
  return (
      <div>
        <img
          alt="Logo"
          src="/static/logo.png"
          width={'100px'}
          {...props}
        />   
      </div>
      
    
  );
};

export default Logo;
