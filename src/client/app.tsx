// tslint:disable:no-expression-statement

import * as moment from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';

import { Logger } from '../utils/logger';
import { actions } from './store';
import { ShoppingList } from './store/domain/shoppingList/shoppingList';
import { RootState } from './store/rootState';

// tslint:disable-next-line:no-var-requires
const styles: any = require('./app.css');
const logging = Logger.info('qq', styles);

interface AppProps {
    readonly listName: string;
    readonly list: ReadonlyArray<ShoppingList>;
}

interface DispatchProps {
    readonly onAddListItem: (text: string) => any;
}

interface AppState {
    readonly listNameValue: string;
    readonly addItemEditMode: boolean;
}

class AppComponent extends React.Component<AppProps & DispatchProps, AppState> {
    private listNameValue: string;

    constructor(props?: AppProps & DispatchProps, context?: any) {
        super(props);
        this.state = {
            listNameValue: this.props.listName,
            addItemEditMode: false
        };
    }

    public handleChange(event: React.FormEvent<HTMLInputElement>) {
        event.preventDefault();
        const value = (event.target as any).value;
        this.setState({ listNameValue: value });
    }

    public handleKey(event: React.KeyboardEvent<HTMLInputElement>) {
        event.preventDefault();
        if (event.key === 'Enter') {
            if (this.props.onAddListItem) {
                this.props.onAddListItem(this.state.listNameValue);
                this.setState({ listNameValue: '' });
            }
        }
    }

    // <input type={'text'} value={this.state.listNameValue} onChange={(e) => this.handleChange(e)} />
    public render() {
        return (<div className={styles.app}>
            {this.today()}
            Купить <input value={this.state.listNameValue} className={styles.listItemText} type={'text'} onChange={(e) => this.handleChange(e)} onKeyUp={(e) => this.handleKey(e)}/>
            {this.renderList()}
        </div>);
    }

    private today() {
        moment.locale('ru');
        const now = moment().format('DD MMM YYYY');
        return (
            <h2>{now}</h2>
        );
    }

    private editInPlace() {
        if (!this.state.addItemEditMode) {
            return null;
        }
        return (
            <li>
                <input type={'text'} />
            </li>
        );
    }

    private renderList() {
        if (!this.props.list || this.props.list.length === 0) {
            return (<p>Списки покупок не добавлены</p>);
        }
        return (
            <ul>
                {this.props.list.map(x => (
                    <li key={x.id}>
                        <p>{x.date.format('DD-MM-YYYY')}</p>
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
        onAddListItem: (text: string) =>
            dispatch(actions.domain.addShoppingListItem({ text }))
    };
};

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
