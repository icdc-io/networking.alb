import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Input, Table, Button, Header } from 'semantic-ui-react';
import './loadBalancer.scss';
import OptionsMenu from '../general/optionsMenu';
import { Link, useParams } from 'react-router-dom';
import { createroutePath, detailsPath } from '../constants/routes';
import { onSearch } from '../utilities/search';
import { copyInfo } from '../utilities/copyInfo';
import { useSelector } from 'react-redux';

const WebRoutesList = ({ t, items }) => {
    const { menuGroup } = useParams();
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const user = useSelector(state => state.host.user);

    useEffect(() => {
        setFilteredData(onSearch(items, search));
    }, [search, items]);

    const headerRow = [
        { title: t('name') },
        { title: t('hostname') },
        { title: t('targetPort') },
        { title: t('tlsTermination') },
        { title: t('service') },
        { title: '' }
    ];

    const publicHostname = `${user.account}.alb.${user.location}.icdc.io`;

    const routes = filteredData.map(el => {
        const options = ['viewRoutes'];
        const service = (route) => route.services.map(e => e.name).join(', ');

        return (
            <Table.Row key={el.id}>
                <Table.Cell width={2}>
                    <div>
                        <Link to={detailsPath(menuGroup, el.id)}>{el.name}</Link>
                    </div>
                </Table.Cell>

                <Table.Cell width={3}>{el.hostname}</Table.Cell>
                <Table.Cell width={2}>{el.target_port ? el.target_port : '—'}</Table.Cell>
                <Table.Cell width={2}>{el.tls_termination ? el.tls_termination : '—'}</Table.Cell>
                <Table.Cell width={6}>{service(el)}</Table.Cell>
                <Table.Cell width={2} textAlign='right'>
                    {true && <OptionsMenu t={t} type='traefik' instance={el} options={options} /> || ''}
                </Table.Cell>
            </Table.Row>);
    });

    return (
        <section>
            <div className='loadBalancerDescription'>
                <p >{t('traefikDescriptionOne')}</p>
                <div className='publicHostname'>
                    <span>{t('publicHostname')}</span>
                    <span>{publicHostname}{copyInfo(publicHostname)}</span>
                </div>
                <p>{t('traefikDescriptionTwo')}</p>
            </div>
            <Header as='h4' className='webRoutesHeader' content={t('webRoutes')} />

            <div className='tools'>
                <Input
                    icon='search'
                    iconPosition='left'
                    placeholder={t('searchField')}
                    style={{ width: '600px', margin: '10px 0px 20px 0px' }}
                    value={search}
                    onChange={e => setSearch(e.currentTarget.value)}
                />
                <Link to={createroutePath(menuGroup)}>
                    <Button primary size="medium" style={{ height: '40px' }}>{t('createRoute')}</Button>
                </Link>
            </div>
            <div>
                <Table basic="very">
                    <Table.Header >
                        <Table.Row >
                            {headerRow.map((el, index) => (
                                <Table.HeaderCell key={index}>
                                    {el.title}
                                </Table.HeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    {filteredData.length > 0 && <Table.Body>{routes}</Table.Body>}
                </Table>
            </div>
        </section>
    );
};

WebRoutesList.propTypes = {
    items: PropTypes.any,
    t: PropTypes.func
};

export default WebRoutesList;
