import React, {Component} from 'react';
import {ListView, Text, View, StatusBar, ActivityIndicator} from 'react-native';
import {ItemEdit} from './NoteEdit';
import {ItemView} from './NoteView';
import {loadItems, cancelLoadItems} from './service';
import {registerRightAction, getLogger, issueToText} from '../core/utils';
import styles from '../core/styles';

const log = getLogger('ItemList');
const NOTE_LIST_ROUTE = 'item/list';

export class ItemList extends Component {
    static get routeName() {
        return NOTE_LIST_ROUTE;
    }

    static get route() {
        return {name: NOTE_LIST_ROUTE, title: 'Item List', rightText: 'New'};
    }

    constructor(props) {
        super(props);
        log('constructor');
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
        this.store = this.props.store;
        const nav = this.props.navigator;
        this.navigator = nav;
        const currentRoutes = nav.getCurrentRoutes();
        const currentRoute = currentRoutes[currentRoutes.length - 1];
        this.user = currentRoute.user;
        const itemState = this.store.getState().item;
        this.state = {isLoading: itemState.isLoading, dataSource: this.ds.cloneWithRows(itemState.items)};
        registerRightAction(this.props.navigator, this.onNewItem.bind(this));
    }

    render() {
        log('render');
        let message = issueToText(this.state.issue);
        return (
            <View style={styles.content}>
                { this.state.isLoading &&
                <ActivityIndicator animating={true} style={styles.activityIndicator} size="large"/>
                }
                {message && <Text>{message}</Text>}
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={item => (<ItemView item={item} onPress={(item) => this.onItemPress(item)}/>)}/>
            </View>
        );
    }

    onNewItem() {
        log('onNewItem');
        this.props.navigator.push({...ItemEdit.route, user: this.user});
    }

    onItemPress(item) {
        log('onItemPress');
        this.props.navigator.push({...ItemEdit.route, user: this.user, data: item});
    }

    componentDidMount() {
        log('componentDidMount');
        this._isMounted = true;
        const store = this.store;
        this.unsubscribe = store.subscribe(() => {
            log('setState');
            const itemState = store.getState().item;
            this.setState({dataSource: this.ds.cloneWithRows(itemState.items), isLoading: itemState.isLoading});
        });
        store.dispatch(loadItems(this.user));
    }

    componentWillUnmount() {
        log('componentWillUnmount');
        this._isMounted = false;
        this.unsubscribe();
        if (this.state.isLoading) {
            this.store.dispatch(cancelLoadItems());
        }
    }
}
