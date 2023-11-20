import React, {  useState } from 'react';
import { PropTypes } from 'prop-types';
import { Button, Checkbox, Popup, Icon } from 'semantic-ui-react';
import FormField from './FormField';

const HeadersFormSection = ({ t, headers, setHeaders }) => {
    const headersKeys = Object.keys(headers);
    const headersValues = Object.values(headers);

    const [headersKeysInputs, setHeadersKeysInputs] = useState(headersKeys.length ? headersKeys : ['']);
    const [headersValuesInputs, setHeadersValuesInputs] = useState(headersValues.length ? headersValues : ['']);
    // const [selectedItems, setSelectedItems] = useState([]);

    const addHeaderInfo = () => {
        setHeadersKeysInputs(prevState => [...prevState, '']);
        setHeadersValuesInputs(prevState => [...prevState, '']);
    };

    const combineValues = (array) => array.reduce((acc, curr, key) => {
        if (curr.trim() && headersValuesInputs[key].trim()) acc[curr] = headersValuesInputs[key];
        return acc;
    }, {})

    const changeHeadersInfo = () => {
        setHeaders(combineValues(headersKeysInputs));
    };

    const filterValues = (key) => (array) => array.filter((_, index) => index !== key);

    const removeHeader = (key) => (_e) => {
        setHeadersKeysInputs(filterValues(key));
        setHeadersValuesInputs(filterValues(key));
        setHeaders(combineValues(filterValues(key)(headersKeysInputs)));
    };

    return <div className='headers-inputs'>
      <div className='header-content'>
          <label>{`${t('headers')} ${t('optional')}`}</label>
          <Popup trigger={<Icon name='question circle outline' />} content={t('tooltipHeaders')} wide='very' />
      </div>
      {
        headersKeysInputs.map((_, key) => (
            <div className='headers-inputs__content' key={key}>
                {/* <Checkbox
                    type="checkbox"
                    checked={selectedItems.includes(key)}
                    onChange={(e, { checked }) => setSelectedItems(prevState => checked ? [...prevState, key] : prevState.filter((_, index) => index !== key))}
                /> */}
                <FormField
                    value={headersKeysInputs[key]}
                    label={''}
                    placeholder={t('name')}
                    callback={e => setHeadersKeysInputs(prevState => prevState.map((item, index) => key === index ? e.target.value : item))}
                    onBlur={changeHeadersInfo}
                />
                <FormField
                    value={headersValuesInputs[key]}
                    label={''}
                    placeholder={t('value')}
                    callback={e => setHeadersValuesInputs(prevState => prevState.map((item, index) => key === index ? e.target.value : item))}
                    onBlur={changeHeadersInfo}
                />
                { headersKeysInputs.length > 1 && <Button size='medium' icon onClick={removeHeader(key)}>
                    <Icon name='trash' />
                </Button> }
            </div>
        ))
      }
      { headersKeysInputs[headersKeysInputs.length - 1].trim() && headersValuesInputs[headersValuesInputs.length - 1].trim() && <Button className='add-header' onClick={addHeaderInfo}>Add</Button> }
    </div>;
};

HeadersFormSection.propTypes = {
    t: PropTypes.func,
    headers: PropTypes.object,
    setHeaders: PropTypes.func
};

export default HeadersFormSection;
