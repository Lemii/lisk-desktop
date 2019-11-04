import React from 'react';
import { mount } from 'enzyme';
import Delegates from './accounts';
import accounts from '../../../../../test/constants/accounts';

jest.mock('../../../../constants/monitor', () => ({ DEFAULT_LIMIT: 4 }));

const accountsApiResponse = Object.values(accounts);

describe('Top Accounts Monitor Page', () => {
  let props;
  let accountsWithData;
  let wrapper;

  const setup = properties => mount(<Delegates {...properties} />);

  beforeEach(() => {
    props = {
      t: key => key,
      accounts: {
        isLoading: true,
        data: [],
        loadData: jest.fn(),
        clearData: jest.fn(),
        urlSearchParams: {},
      },
    };

    accountsWithData = {
      ...props.accounts,
      isLoading: false,
      data: accountsApiResponse,
    };

    wrapper = setup(props);
  });

  it('renders a page with header', () => {
    expect(wrapper.find('Box header')).toIncludeText('Accounts');
  });

  it('renders table with accounts', () => {
    expect(wrapper.find('.accounts-row')).toHaveLength(0);
    wrapper.setProps({ accounts: accountsWithData });
    expect(wrapper.find('.accounts-row').hostNodes()).toHaveLength(accountsApiResponse.length);
  });

  it('shows error if API failed', () => {
    const error = 'Loading failed';
    wrapper.setProps({
      accounts: {
        ...props.accounts,
        isLoading: false,
        error,
      },
    });
    expect(wrapper).toIncludeText(error);
  });
});
