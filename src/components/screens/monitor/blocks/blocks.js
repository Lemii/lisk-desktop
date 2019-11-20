import PropTypes from 'prop-types';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DEFAULT_LIMIT } from '../../../../constants/monitor';
import { DateTimeFromTimestamp } from '../../../toolbox/timestamp';
import { tokenMap } from '../../../../constants/tokens';
import BlockFilterDropdown from './blockFilterDropdown';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxFooterButton from '../../../toolbox/box/footerButton';
import BoxEmptyState from '../../../toolbox/box/emptyState';
import FilterBar from '../../../shared/filterBar';
import Illustration from '../../../toolbox/illustration';
import LiskAmount from '../../../shared/liskAmount';
import MonitorHeader from '../header';
import Table from '../../../toolbox/table';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import routes from '../../../../constants/routes';
import styles from './blocks.css';
import withFilters from '../../../../utils/withFilters';
import BlocksOverview from './blocksOverview';

const Blocks = ({
  t, blocks,
  filters, applyFilters, clearFilter, clearAllFilters,
  sort, changeSort,
}) => {
  const formatters = {
    height: value => `${t('Height')}: ${value}`,
    address: value => `${t('Generated by')}: ${value}`,
  };

  const handleLoadMore = () => {
    blocks.loadData(Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: filters[key] }),
    }), {
      offset: blocks.data.length,
      sort,
    }));
  };

  return (
    <div>
      <MonitorHeader />
      <BlocksOverview blocks={blocks} t={t} />
      <Box isLoading={blocks.isLoading} width="full" main>
        <BoxHeader>
          <h2>{t('All blocks')}</h2>
          <BlockFilterDropdown filters={filters} applyFilters={applyFilters} />
        </BoxHeader>
        <FilterBar {...{
          clearFilter, clearAllFilters, filters, formatters, t,
        }}
        />
        {!blocks.isLoading && blocks.data.length === 0
          ? (
            <BoxContent>
              <BoxEmptyState>
                <Illustration name="emptyWallet" />
                <h3>{`${blocks.error || t('No search results in given criteria.')}`}</h3>
              </BoxEmptyState>
            </BoxContent>
          )
          : (
            <React.Fragment>
              <BoxContent className={styles.content}>
                <Table
                  getRowLink={block => `${routes.blocks.path}/${block.id}`}
                  data={blocks.data}
                  sort={sort}
                  onSortChange={changeSort}
                  columns={[{
                    /* eslint-disable react/display-name */
                    id: 'height',
                    header: t('Height'),
                    className: grid['col-xs-2'],
                    isSortable: true,
                  }, {
                    id: 'timestamp',
                    header: t('Date'),
                    className: `${grid['col-md-2']} ${grid['col-xs-3']}`,
                    getValue: block => <DateTimeFromTimestamp time={block.timestamp * 1000} token="BTC" />,
                  }, {
                    id: 'numberOfTransactions',
                    header: t('Transactions'),
                    className: `${grid['col-xs-2']} hidden-m`,
                  }, {
                    id: 'generatorUsername',
                    header: t('Generated by'),
                    className: grid['col-xs-3'],
                  }, {
                    id: 'totalAmount',
                    header: t('Amount'),
                    className: grid['col-xs-2'],
                    getValue: block => (
                      <Tooltip
                        title={t('Transactions')}
                        className="showOnBottom"
                        tooltipClassName={styles.showM}
                        size="s"
                        content={<LiskAmount val={block.totalAmount} token={tokenMap.LSK.key} />}
                      >
                        <p>{block.numberOfTransactions}</p>
                      </Tooltip>
                    ),
                  }, {
                    id: 'totalForged',
                    header: t('Forged'),
                    className: `${grid['col-md-1']} ${grid['col-xs-2']}`,
                    getValue: block => (
                      <LiskAmount val={block.totalForged} token={tokenMap.LSK.key} />
                    ),
                    /* eslint-enable react/display-name */
                  }]}
                />
              </BoxContent>
              {!!blocks.data.length && blocks.data.length % DEFAULT_LIMIT === 0 && (
              <BoxFooterButton
                className="load-more"
                onClick={handleLoadMore}
              >
                {t('Load more')}
              </BoxFooterButton>
              )}
            </React.Fragment>
          )
      }
      </Box>
    </div>
  );
};

Blocks.propTypes = {
  t: PropTypes.func.isRequired,
  blocks: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
};

const defaultFilters = {
  dateFrom: '',
  dateTo: '',
  height: '',
  address: '',
};
const defaultSort = 'height:desc';

export default withFilters('blocks', defaultFilters, defaultSort)(Blocks);
