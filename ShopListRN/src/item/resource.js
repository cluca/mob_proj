import {getLogger, ResourceError} from '../core/utils';
import {apiUrl, authHeaders} from '../core/api';

const log = getLogger('note/resource');

export const search = async(token, user) => {
    const url = `${apiUrl}/shoplist?id=`+user._id;
    log(`GET ${url}`);
    let ok;
    let json = await fetch(url, {method: 'GET', headers: authHeaders(token)})
        .then(res => {
            ok = res.ok;
            return res.json();
        });
    return interpretResult('GET', url, ok, json.data);
};

export const save = async(token, item, user) => {
    const body = JSON.stringify({data: item, user:user._id});
    let url;
    if (item.idLista){
        url = `${apiUrl}/item?itemText=`+ item.text+'&itemId='+item.idLista+'&userId='+user._id;
    }else{
        url = `${apiUrl}/item?itemText=`+ item.text+'&userId='+user._id;
    }
    log(`${url}`);
    let ok;
    let json = await fetch(url, {method:'POST', headers: authHeaders(token), body})
        .then(res => {
            ok = res.ok;
            return res.json();
        });
    return interpretResult('GET', url, ok, json.data[0]);
};

export const deleteItem = async(item, user) => {
    let url = `${apiUrl}/deleteItem?itemId=${item.idLista}&userId=${user._id}`;
    log(`${url}`);
    let ok;
    let json = await fetch(url, {method:'POST'})
        .then(res => {
            ok = res.ok;
            return res.json();
        });
    return interpretResult('GET', url, ok, json.data[0]);
};

function interpretResult(method, url, ok, json) {
    if (ok) {
        log(`${method} ${url} succeeded`);
        return json;
    } else {
        log(`${method} ${url} failed`);
        throw new ResourceError('Fetch failed', json.issue);
    }
}