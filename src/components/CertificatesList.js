import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { PropTypes } from 'prop-types';
import messages from '../Messages';
import { Input, Table, Button } from 'semantic-ui-react';
import './loadBalancer.scss';
import OptionsMenu from '../general/optionsMenu';
import { Link, useParams } from 'react-router-dom';
import { createCertificatePath, certificateDetailsPath } from '../constants/routes';
import { onSearch } from '../utilities/search';

const CertificatesList = ({  items, intl }) => {
    const { menuGroup } = useParams();
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setFilteredData(onSearch(items, search));
    }, [search, items]);

    const certificates = filteredData.map(el => {

        const options = ['viewCertificate'];
        return (
            <Table.Row key={el.id}>
                <Table.Cell textAlign='left'><Link to={certificateDetailsPath(menuGroup, el.id)}>{el.name}</Link></Table.Cell>
                <Table.Cell textAlign='right'>
                    {true && <OptionsMenu type='traefik' instance={el} options={options} /> || ''}
                </Table.Cell>
            </Table.Row>);
    });

    return (
        <section>
            <div className='tools'>
                <Input
                    icon='search'
                    iconPosition='left'
                    style={{ width: '600px', margin: '10px 0px 20px 0px' }}
                    placeholder={intl.formatMessage(messages.searchField)}
                    value={search}
                    onChange={e => setSearch(e.currentTarget.value)}
                />
                <Link to={createCertificatePath(menuGroup)}>
                    <Button primary size="medium" style={{ height: '40px' }}>{intl.formatMessage(messages.createCertificate)}</Button>
                </Link>
            </div>
            <div>
                <Table basic="very" className='bordered'>
                    {filteredData.length > 0 && <Table.Body>{certificates}</Table.Body>}
                </Table>
            </div>
        </section>
    );
};

CertificatesList.propTypes = {
    items: PropTypes.array,
    intl: PropTypes.any
};

export default injectIntl(CertificatesList);
