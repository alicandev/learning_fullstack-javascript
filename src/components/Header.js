import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ message }) => (
  <h2 className="Header text-center">
    {message}
  </h2>
);

Header.propTypes = {
  message: PropTypes.string.isRequired
};

export default Header;