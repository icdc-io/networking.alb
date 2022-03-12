import React from 'react';
import { Form, Input } from 'semantic-ui-react';
import { PropTypes } from 'prop-types';

const FormField = ({ label, value, callback, placeholder, error }) => {
    return (
        <Form.Field style={{ marginBottom: '2px' }} error={error}>
            <label>{label}</label>
            <Input value={value} onChange={callback} placeholder={placeholder} type='text'/>
        </Form.Field>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    callback: PropTypes.func,
    placeholder: PropTypes.string,
    error: PropTypes.any
};

export default FormField;
