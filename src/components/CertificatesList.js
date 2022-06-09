import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Input, Table, Button } from 'semantic-ui-react';
import './loadBalancer.scss';
import OptionsMenu from '../general/optionsMenu';
import { Link, useParams } from 'react-router-dom';
import { createCertificatePath, certificateDetailsPath } from '../constants/routes';
import { onSearch } from '../utilities/search';
import { useSelector } from 'react-redux';
import CertificateImg from '../static/images/certificate.svg';
const ApiButton = React.lazy(() => import('container/ApiButton'));

const CertificatesList = ({ t, items }) => {
    const { menuGroup } = useParams();
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const user = useSelector(state => state.host.user);
    const baseUrls = useSelector(state => state.host.baseUrls);

    useEffect(() => {
        setFilteredData(onSearch(items, search));
    }, [search, items]);

    const certificates = filteredData.map(el => {

        const options = ['edit', 'deleteCertificate'];
        return (
            <Table.Row key={el.id}>
                <Table.Cell textAlign='left'>
                    <div className='name-wrapper'>
                        <img src={CertificateImg} width='35' />
                        <Link to={certificateDetailsPath(menuGroup, el.id)}>{el.name}</Link>
                    </div>
                </Table.Cell>
                <Table.Cell textAlign='right'>
                    {<OptionsMenu t={t} type='certificates' instance={el} options={options} /> || ''}
                </Table.Cell>
            </Table.Row>);
    });

    return (
        <section>
            <div className='tools'>
                <Input
                    icon='search'
                    iconPosition='left'
                    style={{ width: '600px', margin: '10px 0px 0px 0px' }}
                    placeholder={t('searchField')}
                    value={search}
                    onChange={e => setSearch(e.currentTarget.value)}
                />
                <div className='create-route-buttons'>
                    <ApiButton element='certificates'
                        item={{ destination: '10.112.0.1/24', nexthop: '0.0.0.0' }}
                        user={user} 
                        locationUrl={baseUrls[user.location]}/>
                    <Link to={createCertificatePath(menuGroup)}>
                        <Button primary size="medium" style={{ height: '40px' }}>{t('createCertificate')}</Button>
                    </Link>
                </div>
            </div>
            <div className='table-container'>
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
