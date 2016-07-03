import { Component, PropTypes, Children } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import hoistNonReactStatic from 'hoist-non-react-statics';

const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
});

export class Provider extends Component {
  static propTypes = {
    store: storeShape.isRequired,
    children: PropTypes.element.isRequired
  };

  static childContextTypes = {
    store: storeShape.isRequired
  };

  getChildContext() {
    return { store: this.props.store };
  }

  render() {
    return Children.only(this.props.children);
  }
}

export function connect(mapStateToProps, mapDispatchToProps) {
  const shouldSubscribe = Boolean(mapStateToProps);
  const mapState = mapStateToProps || (state) => { return {}; };
  const mapDispatch = mapDispatchToProps || (dispatch) => { return { dispatch }; };
  const mergeProps = (stateProps, dispatchProps, parentProps) => {
    return {
      ...parentProps,
      ...stateProps,
      ...dispatchProps
    };
  };

  return function(WrappedComponent) {
    class Connect extends Component {
      static contextTypes = {
        store: storeShape
      };

      static propTypes = {
        store: storeShape
      };

      constructor(props, context) {
        super(props, context);
        this.store = props.store || context.store;
        this.state = mapState(this.store.getState(), props);
        this.dispatchProps = mapDispatch(this.store.dispatch, props);
      }

      shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      }

      componentDidMount() {
        if (!shouldSubscribe) { return; }
        this.unsubscribe = this.store.subscribe(this.onUpdateStore.bind(this));
      }

      componentWillUnmount() {
        if (!shouldSubscribe) { return; }
        this.unsubscribe();
        this.unsubscribe = null;
      }

      onUpdateStore(nextStoreState) {
        this.setState(mapState(nextStoreState, this.props));
      }

      render() {
        const mergedProps = mergeProps(
          this.state,
          this.dispatchProps,
          this.props
        );
        return (<WrappedComponent {...mergedProps} />);
      }
    }

    return hoistNonReactStatic(Connect, WrappedComponent);
  }
}
