import React from 'react';
import Waypoint from 'react-waypoint';
import { connect } from 'react-redux';
import tableStyle from 'react-toolbox/lib/table/theme.css';
import TransactionRow from './transactionRow';
import TransactionsHeader from './transactionsHeader';
import { transactionsRequestInit } from '../../actions/transactions';
import styles from './transactions.css';

class TransactionsList extends React.Component {
  constructor(props) {
    super(props);
    this.props.transactionsRequestInit({ address: this.props.address });
  }

  // eslint-disable-next-line class-methods-use-this
  isLargeScreen() {
    return window.innerWidth > 768;
  }

  render() {
    if (this.props.transactions.length > 0) {
      return <div className={`${styles.results} transaction-results`}>
        <TransactionsHeader tableStyle={tableStyle}></TransactionsHeader>
        {this.props.transactions.map((transaction, i) => (
          <TransactionRow address={this.props.address}
            key={i}
            t={this.props.t}
            value={transaction}
            nextStep={this.props.nextStep}
          />
        ))}
        {
          // the transaction list should be scrollable on a large screen
          // otherwise (XS) the whole transaction box will be scrollable
          // (see transactionOverview.js)
          this.isLargeScreen()
            ? <Waypoint bottomOffset='-80%'
              key={this.props.transactions.length}
              onEnter={() => { this.props.loadMore(); }}></Waypoint>
            : null
        }
      </div>;
    } else if (!this.props.loadMore) {
      return <p className={`${styles.empty} hasPaddingRow empty-message`}>
        {this.props.t('There are no transactions yet.')}
      </p>;
    } else if (!this.props.filter || this.props.filter === 0) {
      return null;
    }
    return <p className={`${styles.empty} hasPaddingRow empty-message`}>
      {this.props.t('There are no {{filterName}} transactions.', {
        filterName: this.props.filter && this.props.filter.name ? this.props.filter.name.toLowerCase() : '',
      })}
    </p>;
  }
}

const mapDispatchToProps = dispatch => ({
  transactionsRequestInit: data => dispatch(transactionsRequestInit(data)),
});

export default connect(null, mapDispatchToProps)(TransactionsList);
