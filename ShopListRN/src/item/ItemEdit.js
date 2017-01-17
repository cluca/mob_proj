import React, {Component} from 'react';
import {Text, View, TextInput, ActivityIndicator, TouchableOpacity, Alert, Vibration} from 'react-native';
import {saveItem, cancelSaveItem, deleteItemS} from './service';
import {registerRightAction, issueToText, getLogger} from '../core/utils';
import styles from '../core/styles';

const log = getLogger('ItemEdit');
const NOTE_EDIT_ROUTE = 'item/edit';
export class ItemEdit extends Component {
    static get routeName() {
        return NOTE_EDIT_ROUTE;
    }

    static get route() {
        return {name: NOTE_EDIT_ROUTE, title: 'Product Edit', rightText: 'Save'};
    }

    constructor(props) {
        log('constructor');
        super(props);
        this.store = this.props.store;
        const nav = this.props.navigator;
        this.navigator = nav;
        const currentRoutes = nav.getCurrentRoutes();
        const currentRoute = currentRoutes[currentRoutes.length - 1];
        if (currentRoute.data) {
            this.state = {item: {...currentRoute.data}, isSaving: false};
            this.item = currentRoute.data;
        } else {
            this.state = {item: {text: ''}, isSaving: false};
        }
        this.user = currentRoute.user;
        registerRightAction(nav, this.onSave.bind(this));
    }

    render() {
        log('render');
        const state = this.state;
        let message = issueToText(state.issue);
        return (
            <View style={styles.content}>
                { state.isSaving &&
                <ActivityIndicator animating={true} style={styles.activityIndicator} size="large"/>
                }
                <Text>Product name</Text>
                <TextInput value={state.item.text} onChangeText={(text) => this.updateItemText(text)}/>
                <TouchableOpacity
                    onPress={() => this.onDelete()}>
                    <Text style={styles.deleteButton}>
                        Delete
                    </Text>
                </TouchableOpacity>
                {message && <Text>{message}</Text>}

            </View>
        );
    }

    componentDidMount() {
        log('componentDidMount');
        this._isMounted = true;
        const store = this.props.store;
        this.unsubscribe = store.subscribe(() => {
            log('setState');
            const state = this.state;
            const itemState = store.getState().item;
            this.setState({...state, issue: itemState.issue});
        });
    }

    componentWillUnmount() {
        log('componentWillUnmount');
        this._isMounted = false;
        this.unsubscribe();
        if (this.state.isLoading) {
            this.store.dispatch(cancelSaveItem());
        }
    }

    updateItemText(text) {
        let newState = {...this.state};
        newState.item.text = text;
        this.setState(newState);
    }

    onSave() {
        log('onSave');
        this.store.dispatch(saveItem(this.state.item, this.user)).then(() => {
            log('onItemSaved');
            if (!this.state.issue) {
                this.navigator.pop();
            }
        });
    }

    onDelete(){
        log('onDelete');
        if (this.item){
            this.store.dispatch(deleteItemS(this.state.item, this.user)).then(() => {
                log('onItemDeleted');
                if (!this.state.issue) {
                    this.navigator.pop();
                    Alert.alert(`Produsul ${JSON.stringify(this.state.deletedItem)}\na fost sters!`);
                }
            });
        } else {
            Vibration.vibrate([0, 500, 200, 500]);
            Alert.alert('Produsul nu poate fi sters\npentru ca nu a fost adaugat\ninca!');
        }

    }
}