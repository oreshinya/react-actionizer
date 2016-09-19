# React Actionizer
[![npm version](https://badge.fury.io/js/react-actionizer.svg)](https://badge.fury.io/js/react-actionizer)
[![Build Status](https://travis-ci.org/oreshinya/react-actionizer.svg?branch=master)](https://travis-ci.org/oreshinya/react-actionizer)

React bindings for [Actionizer](https://github.com/oreshinya/actionizer).

## Dependencies
- `react`
- `react-addons-shallow-compare`
- `actionizer`

## Installation

```
$ npm i --save react-actionizer
```

## Usage

```javascript
import { createSelector } from 'reselect';
import { connect } from 'react-actionizer';

const todoSelector = (state, props) => {
  return state.getIn(["todosById", `${props.id}`]);
};

const mapStateToProps = createSelector(
  todoSelector,
  (todo) => {
    return {todo};
  }
);

const renameTodo = function*(id) {
  yield reduce((state) => {
    return state.setIn(
      ['todosById', `${id}`, 'title'],
      'Renamed'
    );
  });
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    rename() {
      dispatch(renameTodo(props.id));
    }
  };
};

// Connect
@connect(mapStateToProps, mapDispatchToProps)
class Todo extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    todo: PropTypes.object.isRequired,
    rename: PropTypes.func.isRequired
  };

  render() {
    const { todo, rename } = this.props;
    return (
      <li onClick={rename.bind(this)}>
        {todo.get('title')}
      </li>
    );
  }
}

// In entry point
import { Provider } from 'react-actionizer';

window.addEventListener('load', () => {
  const container = document.querySelector('#app');
  const element = (
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
  ReactDOM.render(element, container);
});
```

## API

### `<Provider store>`
Makes the Actionizer store available in `connect`ed component.

#### Props
- `store`: Actionizer store.
- `children`: The root of your component hierarchy.

### `connect(mapStateToProps, mapDispatchToProps)`
Connects a React component and Actionizer store.

#### Arguments
- `mapStateToProps(state, props): stateProps`: Generate props from store state. This will be called when store will be changed. Returned object is merged in passed own props.
- `mapDispatchToProps(dispatch, props): dispatchProps`: Generate props for dispatch functions. This will be called once initializing component. Returned object is merged in passed own props.

## LICENSE

MIT
