# React Actionizer
[![npm version](https://badge.fury.io/js/react-actionizer.svg)](https://badge.fury.io/js/react-actionizer)

React bindings for [Actionizer](https://github.com/oreshinya/actionizer).

## Dependencies
- `react`
- `react-addons-shallow-compare`

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
  const state = yield select();
  const nextState = state.setIn(['todosById', `${id}`, 'title'], 'Renamed');
  yield put(nextState);
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

## LICENSE

MIT

## TODO
- Add tests
