import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Input, Table, Button, Header, Popup, Icon } from 'semantic-ui-react';
import './loadBalancer.scss';
import OptionsMenu from '../general/optionsMenu';
import { Link, useParams } from 'react-router-dom';
import { createroutePath, detailsPath } from '../constants/routes';
import { onSearch } from '../utilities/search';
import { copyInfo } from '../utilities/copyInfo';
import { useSelector } from 'react-redux';
import WebRoute from '../static/images/webroutes.svg';
const ApiButton = React.lazy(() => import('container/ApiButton'));

const WebRoutesList = ({ t, items }) => {
    const { menuGroup } = useParams();
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const user = useSelector(state => state.host.user);
    const baseUrls = useSelector(state => state.host.baseUrls);
    const traefikGateways = useSelector(state => state.BalancerStore.traefikGateways);

    const [sortUp, setSortUp] = useState(true);
    useEffect(() => {
        sortUp ?
            setFilteredData([...items].sort((a,b) => a.cloud_gateway_id < b.cloud_gateway_id ? 1 : -1))
            : setFilteredData([...items].sort((a,b) => a.cloud_gateway_id > b.cloud_gateway_id ? 1 : -1))
    }, [sortUp]);

    useEffect(() => {
        setFilteredData(onSearch(items, search));
    }, [search, items]);

    const headerRow = [
        { title: t('name') },
        { title: t('hostname') },
        { title: t('targetPort') },
        { title: t('tlsTermination') },
        { title: t('service') },
        { title: t('balancer') },
        { title: '' }
    ];

    const publicHostname = `${user.account}.alb.${user.location}.icdc.io`;

    const routes = filteredData.map(el => {
        const options = ['edit', 'deleteWebRoutes'];
        const service = (route) => route.services.map((e, i) => 
            <div  key={i} >
                <a 
                    href={`https://compute-dev.zby.icdc.io/ui/service/services/${e.ext_id}`}
                    target='_blank'>
                        {`${e.name} (${e.ext_id})`}
                </a>
                <br/>
            </div>).slice();

        return (
            <Table.Row key={el.id}>
                <Table.Cell width={2}>
                    <div className='name-wrapper'>
                        <img src={WebRoute} width='35' />
                        <Link to={detailsPath(menuGroup, el.id)}>{el.name}</Link>
                    </div>
                </Table.Cell>

                <Table.Cell width={2}>{el.hostname}</Table.Cell>
                <Table.Cell width={1}>{el.target_port ? el.target_port : '—'}</Table.Cell>
                <Table.Cell width={2}>{el.tls_termination ? el.tls_termination : '—'}</Table.Cell>
                <Table.Cell width={4}>
                    <div className='td-wrapper'>
                        {el.services.length > 0 ? <a 
                            href={`https://compute-dev.zby.icdc.io/ui/service/services/${el.services[0]?.ext_id}`}
                            target='_blank'>
                                {`${el.services[0].name} (${el.services[0].ext_id})`}
                        </a> : '—'}
                            {el.services.length > 0 && <Popup
                                on='click'
                                pinned
                                position='top right'
                                inverted
                                trigger={<div className='popup-dots'>...</div>}
                            >
                            {service(el)}
                            </Popup>}
                    </div>
                </Table.Cell>
                <Table.Cell width={4}>{el.cloud_gateway ?`${el.cloud_gateway.cloudgw_instance} (${el.cloud_gateway.name})` : '—'}</Table.Cell>
                <Table.Cell width={1} textAlign='right'>
                    {true && <OptionsMenu t={t} type='webRoutes' instance={el} options={options} /> || ''}

                </Table.Cell>
            </Table.Row>);
    });

    const headers = headerRow.map((el, index) => {
        if(index == 5) {
            return <Table.HeaderCell 
                            className={`sort-col ${sortUp ? 'ascending' : 'descending'}`} 
                            key={index} 
                            onClick={() => setSortUp(prev => !prev)}>
                        {el.title}
                    </Table.HeaderCell>
      } else return <Table.HeaderCell key={index}>{el.title}</Table.HeaderCell>        
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
                    style={{ width: '600px', margin: '10px 0px 0px 0px' }}
                    value={search}
                    onChange={e => setSearch(e.currentTarget.value)}
                />
                <div className='create-route-buttons'>
                    <ApiButton element='routes'
                        item={{ destination: '10.112.0.1/24', nexthop: '0.0.0.0' }}
                        user={user}
                        locationUrl={baseUrls[user.location]} />
                   
                        {!traefikGateways.length ?
                            <Popup
                            on='hover'
                            pinned
                            trigger={<Button color='blue'  size='small' className='disabled-btn' >
                                    {t('createWebRoute')}<Icon name='question circle outline' size='large' className='info-icon'/>
                                </Button>}
                            inverted
                            className='vpn'
                            position='top right'
                        >{t('balancerPopup')}</Popup> :
                        <Link to={createroutePath(menuGroup)}><Button primary size="medium" style={{ height: '40px' }}>{t('createWebRoute')}</Button> </Link>}
                   
                </div>
            </div>
            <div>
                <Table basic="very">
                    <Table.Header >
                        <Table.Row >
                            {headers}
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
