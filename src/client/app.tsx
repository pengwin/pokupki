// tslint:disable:no-expression-statement

import * as React from 'react';
import { connect } from 'react-redux';

import { actions } from './store';
import { ShoppingList } from './store/domain/shoppingList/shoppingList';
import { RootState } from './store/rootState';

interface AppProps {
    readonly listName: string;
    readonly list: ReadonlyArray<ShoppingList>;
}

interface DispatchProps {
    readonly onAddList: (name: string) => any;
    readonly onAddListItem: (parentId: string, text: string) => any;
}

interface AppState {
    // tslint:disable-next-line:readonly-keyword
    listNameValue: string;
}

class AppComponent extends React.Component<AppProps & DispatchProps, AppState> {
    private listNameValue: string;

    constructor(props?: AppProps & DispatchProps, context?: any) {
        super(props);
        this.state = {
            listNameValue: this.props.listName
        };
    }

    public handleChange(event: any) {
        const value = event.target.value;
        this.setState({ listNameValue: value });
    }

    public addList(event: any) {
        event.preventDefault();

        if (!this.state.listNameValue) {
            return;
        }

        if (this.props.onAddList) {
            this.props.onAddList(this.state.listNameValue);
        }
    }

    public addListItem(event: any, parentId: string) {
        event.preventDefault();
        if (this.props.onAddListItem) {
            this.props.onAddListItem(parentId, 'qq');
        }
    }

    public render() {
        return (<div>
            <h1>Hello</h1>
            <input type={'text'} value={this.state.listNameValue} onChange={(e) => this.handleChange(e)} />
            <button onClick={(e) => this.addList(e)}>Добавить</button>
            {this.renderList()}
        </div>);
    }

    private renderList() {
        if (!this.props.list || this.props.list.length === 0) {
            return (<p>Списки покупок не добавлены</p>);
        }
        return (
            <ul>
                {this.props.list.map(x => (
                    <li key={x.id}>
                        <p>{x.name}</p>
                        <button onClick={(e) => this.addListItem(e, x.id)}>Add</button>
                        <ul>
                            {x.items.map(i => (<li key={i.id}>{i.text}</li>))}
                        </ul>
                    </li>
                ))}
            </ul>
        );
    }
}

const mapStateToProps = (state: RootState, ownProps: AppProps): AppProps => {
    return {
        listName: ownProps.listName,
        list: state.domain.shoppingLists.lists.slice()
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onAddList: (name: string) => dispatch(actions.domain.createShoppingList({ name })),
        onAddListItem: (parentId: string, text: string) =>
            dispatch(actions.domain.createShoppingListItem({ text, parentId }))
    };
};

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
