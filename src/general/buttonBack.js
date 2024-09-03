import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";

const ButtonBack = ({ back, path }) => {
  return (
    <Link to={path} relative="path">
      <Button
        className="back back__top"
        labelPosition="left"
        icon="left chevron"
        content={back}
      />
    </Link>
  );
};

ButtonBack.propTypes = {
  back: PropTypes.string,
  path: PropTypes.any,
};

export default ButtonBack;
