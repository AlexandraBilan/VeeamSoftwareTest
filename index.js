function get_element_by_id(id){
    return document.getElementById(id);
}
function create_tag(tag){
    return document.createElement(tag);
}
function get_data(url) {
    return fetch(url)
        .then((response) => response.json())
        .then((hitsJSON) => {
            return hitsJSON;
        })
        .catch((e) => {
            alert('Error: ' + e.message);
        });
}


