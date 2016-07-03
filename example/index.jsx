import 'babel-polyfill';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { fromJS } from 'immutable';
import { createSelector } from 'reselect';
import { createStore, select, put } from 'actionizer';
import { Provider, connect } from '../src';

const initialState = fromJS({
  todos: [1,2,3,4],
  todosById: {
    1: {id: 1, title: 'Todo 1', done: false, userId: 1},
    2: {id: 2, title: 'Todo 2', done: false, userId: 2},
    3: {id: 3, title: 'Todo 3', done: false, userId: 1},
    4: {id: 4, title: 'Todo 4', done: false, userId: 1}
  },
  usersById: {
    1: {id: 1, name: 'Mike'},
    2: {id: 2, name: 'Tom'}
  }
});

const store = createStore(initialState);

const todosSelector = (state) => {
  return state.get("todos");
};

const todoList = createSelector(
  todosSelector,
  (todos) => {
    return {todos};
  }
);

@connect(todoList)
class TodoList extends Component {
  static propTypes = {
    todos: PropTypes.object.isRequired
  };

  render() {
    const { todos } = this.props;
    return (
      <ul>
        {todos.map((todo) => {
          return (<Todo key={todo} id={todo} />);
        })}
      </ul>
    );
  }
}

const todoSelector = (state, props) => {
  return state.getIn(["todosById", `${props.id}`]);
};

const todo = createSelector(
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

const mapDispatchForTodo = (dispatch, props) => {
  return {
    rename() {
      dispatch(renameTodo(props.id));
    }
  };
};


@connect(todo, mapDispatchForTodo)
class Todo extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    todo: PropTypes.object.isRequired,
    rename: PropTypes.func.isRequired
  };

  render() {
    const { todo, rename } = this.props;
    return (
      <li>
        <div onClick={rename.bind(this)}>{todo.get('title')}</div>
        <User id={todo.get('userId')} />
      </li>
    );
  }
}

const renameUser = function*(id) {
  const state = yield select();
  const nextState = state.setIn(['usersById', `${id}`, 'name'], 'Renamed');
  yield put(nextState);
}

const userSelector = (state, props) => {
  return state.getIn(["usersById", `${props.id}`]);
};

const user = createSelector(
  userSelector,
  (user) => {
    return { user };
  }
);

const mapDispatchForUser = (dispatch, props) => {
  return {
    rename() {
      dispatch(renameUser(props.id));
    }
  };
};

@connect(user, mapDispatchForUser)
class User extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired,
    rename: PropTypes.func.isRequired
  };

  render() {
    const { user, rename } = this.props;
    return (
      <div onClick={rename.bind(this)}>
        {user.get('name')}
      </div>
    );
  }
}

window.addEventListener('load', () => {
  const container = document.querySelector('#app');
  const element = (
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
  ReactDOM.render(element, container);
});
