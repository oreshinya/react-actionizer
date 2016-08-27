import assert from 'power-assert';
import { test } from 'eater/runner';

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'actionizer';
import { select, put } from 'actionizer/commands';
import TestUtils from 'react-addons-test-utils';
import { Provider, connect } from '../src';

test('Provider', () => {
  class Child extends Component {
    static contextTypes = {
      store: PropTypes.object.isRequired
    };

    render() {
      return (<div />);
    }
  }

  const store = createStore({});
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <Child />
    </Provider>
  );
  const child = TestUtils.findRenderedComponentWithType(tree, Child);
  assert(child.context.store === store);
});

test('connect', () => {
  const countUp = function*() {
    const state = yield select();
    yield put(Object.assign({}, state, { count: state.count+1 }));
  };
  const mapStateToProps = ({count}) => {
    return { count };
  };
  const mapDispatchToProps = (dispatch) => {
    return {
      countUp() {
        dispatch(countUp());
      }
    };
  };

  class Passthrough extends Component {
    render() {
      const { count, countUp } = this.props;
      return (
        <div ref="btn" onClick={countUp}>{count}</div>
      );
    }
  }

  @connect(mapStateToProps, mapDispatchToProps)
  class Container extends Component {
    render() {
      return (<Passthrough {...this.props} />);
    }
  }

  const initialState = { count: 0 };
  const store = createStore(initialState);

  const div = document.createElement('div');
  const tree = ReactDOM.render(
    <Provider store={store}>
      <Container />
    </Provider>
  , div);

  const passthrough = TestUtils.findRenderedComponentWithType(tree, Passthrough);
  assert(passthrough.props.count === 0);
  assert(typeof passthrough.props.countUp === 'function');
  const node = passthrough.refs.btn;
  TestUtils.Simulate.click(node);
  assert(passthrough.props.count === 1);

  ReactDOM.unmountComponentAtNode(div);
  store.dispatch(countUp());
  assert(passthrough.props.count === 1);
});
