import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Input, Table, Button } from 'semantic-ui-react';
import './loadBalancer.scss';
import OptionsMenu from '../general/optionsMenu';
import { Link, useParams } from 'react-router-dom';
import { createCertificatePath, certificateDetailsPath } from '../constants/routes';
import { onSearch } from '../utilities/search';

const CertificatesList = ({ t, items }) => {
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
                    {true && <OptionsMenu t={t} type='traefik' instance={el} options={options} /> || ''}
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
                    placeholder={t('searchField')}
                    value={search}
                    onChange={e => setSearch(e.currentTarget.value)}
                />
                <Link to={createCertificatePath(menuGroup)}>
                    <Button primary size="medium" style={{ height: '40px' }}>{t('createCertificate')}</Button>
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
    t: PropTypes.func
};

export default CertificatesList;
