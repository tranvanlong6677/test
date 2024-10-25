import React from 'react';
import PropTypes from 'prop-types';

MsgError.propTypes = {
  content: PropTypes.string.isRequired
};

function MsgError({ content }) {
  return (
    <div
      style={{
        width: '100%',
        textAlign: 'center',
        fontWeight: 700,
        margin: 20,
        color: 'red',
        fontSize: 18
      }}
    >
      {content}
    </div>
  );
}

export default MsgError;
