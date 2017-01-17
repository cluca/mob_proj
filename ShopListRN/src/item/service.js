import {action, getLogger, errorPayload} from '../core/utils';
import {search, save, deleteItem} from './resource';

const log = getLogger('item/service');

const SAVE_ITEM_STARTED = 'item/saveStarted';
const SAVE_ITEM_SUCCEEDED = 'item/saveSucceeded';
const SAVE_ITEM_FAILED = 'item/saveFailed';
const CANCEL_SAVE_ITEM = 'item/cancelSave';

const LOAD_ITEMS_STARTED = 'item/loadStarted';
const LOAD_ITEMS_SUCCEEDED = 'item/loadSucceeded';
const LOAD_ITEMS_FAILED = 'item/loadFailed';
const CANCEL_LOAD_ITEMS = 'item/cancelLoad';

const DELETE_ITEM_STARTED = 'item/deleteStarted';
const DELETE_ITEM_SUCCEEDED = 'item/deleteSucceeded';
const DELETE_ITEM_FAILED = 'item/deleteFailed';
const CANCEL_DELETE_ITEM = 'item/cancelDelete';

export const loadItems = (user) => async(dispatch, getState) => {
    log(`loadItems...`);
    const state = getState();
    const itemState = state.item;
    try {
        dispatch(action(LOAD_ITEMS_STARTED));
        const items = await search(state.auth.token, user)
        log(`loadItems succeeded`);
        if (!itemState.isLoadingCancelled) {
            dispatch(action(LOAD_ITEMS_SUCCEEDED, items));
        }
    } catch(err) {
        log(`loadItems failed`);
        if (!itemState.isLoadingCancelled) {
            dispatch(action(LOAD_ITEMS_FAILED, errorPayload(err)));
        }
    }
};

export const cancelLoadItems = () => action(CANCEL_LOAD_ITEMS);

export const saveItem = (item, user) => async(dispatch, getState) => {
    log(`saveItem...`);
    const state = getState();
    const itemState = state.item;
    try {
        dispatch(action(SAVE_ITEM_STARTED));
        const savedItem = await save(state.auth.token, item, user);
        log(`saveItem succeeded`);
        if (!itemState.isSavingCancelled) {
            dispatch(action(SAVE_ITEM_SUCCEEDED, savedItem));
        }
    } catch(err) {
        log(`saveItem failed`);
        if (!itemState.isSavingCancelled) {
            dispatch(action(SAVE_ITEM_FAILED, errorPayload(err)));
        }
    }
};

export const deleteItemS = (item, user) => async(dispatch, getState) => {
    log(`saveItem...`);
    const state = getState();
    const itemState = state.item;
    try {
        dispatch(action(DELETE_ITEM_STARTED));
        const deletedItem = await deleteItem(item, user);
        log(`saveItem succeeded`);
        if (!itemState.isDeletingCancelled) {
            dispatch(action(DELETE_ITEM_SUCCEEDED, deletedItem));
        }
    } catch(err) {
        log(`saveItem failed`);
        if (!itemState.isDeletingCancelled) {
            dispatch(action(DELETE_ITEM_FAILED, errorPayload(err)));
        }
    }
};

export const cancelSaveItem = () => action(CANCEL_SAVE_ITEM);

export const itemReducer = (state = {items: [], isLoading: false, isSaving: false, isDeleting: false}, action) => { //newState (new object)
    let index;
    let items;
    switch (action.type) {
        case LOAD_ITEMS_STARTED:
            return {...state, isLoading: true, isLoadingCancelled: false, issue: null};
        case LOAD_ITEMS_SUCCEEDED:
            return {...state, items: action.payload, isLoading: false};
        case LOAD_ITEMS_FAILED:
            return {...state, issue: action.payload.issue, isLoading: false};
        case CANCEL_LOAD_ITEMS:
            return {...state, isLoading: false, isLoadingCancelled: true};
        case SAVE_ITEM_STARTED:
            return {...state, isSaving: true, isSavingCancelled: false, issue: null};
        case SAVE_ITEM_SUCCEEDED:
            items = [...state.items];
            index = items.findIndex((i) => i.idLista == action.payload.idLista);
            if (index != -1) {
                items.splice(index, 1, action.payload);
            } else {
                items.push(action.payload);
            }
            return {...state, items, isSaving: false};
        case SAVE_ITEM_FAILED:
            return {...state, issue: action.payload.issue, isSaving: false};
        case CANCEL_SAVE_ITEM:
            return {...state, isSaving: false, isSavingCancelled: true};
        case DELETE_ITEM_SUCCEEDED:
            items = [...state.items];
            index = items.findIndex((i) => i.idLista == action.payload.idLista);
            if (index != -1) {
                items.splice(index, 1);
            } else {
                items.splice(index, 1);
            }
            return {...state, items, isSaving: false, deletedItem: action.payload.text};
        case DELETE_ITEM_STARTED:
            return {...state, isDeleting: true, isDeletingCancelled: false, issue: null};
        case DELETE_ITEM_FAILED:
            return {...state, issue: action.payload.issue, isDeleting: false};
        case CANCEL_DELETE_ITEM:
            return {...state, isSaving: false, isDeletingCancelled: true};
        default:
            return state;
    }
};