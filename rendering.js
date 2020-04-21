let  friends;
const pagination_count = '3';

function initialize() {
    render_person_information(about_person_link);
    render_friend_list();
    render_posts(posts_link);
    get_element_by_id('files_photo').addEventListener('change', change_main_photo, false);
    get_element_by_id('autocomplete').addEventListener('input', autocomplete);
    get_element_by_id('tab_posts').addEventListener('click', get_height_posts);
    window.addEventListener(`resize`, () => {
        get_height_posts();
    });
}

function render_person_information(url){
    get_data(url).then((response) => {
        let about_person = response;
        about_person = about_person['results'][0];
        get_element_by_id('main_profile_photo').src = about_person.picture.large;
        get_element_by_id('first_name').innerText = about_person.name.first;
        get_element_by_id('last_name').innerText = about_person.name.last;
        get_element_by_id('email').innerText = about_person.email;
        get_element_by_id('email').href =  'mailto:'+ about_person.email;
        get_element_by_id('phone').innerText = about_person.phone;
        get_element_by_id('phone').href = 'tel:' + (about_person.phone).replace(/[^\d;]/g, '');
        let full_address = about_person.location.street.number+' '+about_person.location.street.name+', '+about_person.location.city+', '+about_person.location.country;
        get_element_by_id('address').innerText = full_address;
    });
}

async function get_friends() {
    return get_data(friends_link).then(response => {
        return response.data;
    });
}

function render_list(friends){
    let pagination_div = pagination(Math.ceil(friends.length/pagination_count));
    let friends_div = get_element_by_id('friends');
    friends.forEach((friend)=>{
        let id = friend["id"];
        let wrapper_div = create_tag('div');
        let image = create_tag('img');
        image.id = "image" + id;
        let div_with_information = create_tag('div');
        let p_first_name = create_tag('p');
        p_first_name.id = 'first_name'+id;
        let p_last_name = create_tag('p');
        p_last_name.id = 'last_name'+id;
        let p_email = create_tag('p');
        p_email.innerText = 'email: ';
        let a_email = create_tag('a');
        a_email.id = 'email'+id;
        a_email.classList.add('link_color_decoration');
        p_email.appendChild(a_email);

        wrapper_div.appendChild(image);
        div_with_information.appendChild(p_first_name);
        div_with_information.appendChild(p_last_name);
        div_with_information.appendChild(p_email);
        wrapper_div.appendChild(div_with_information);
        wrapper_div.style.display = 'none';
        wrapper_div.id = "block" + id;
        friends_div.appendChild(wrapper_div);
    });
    friends_div.appendChild(pagination_div);
}

async function render_friend_list() {
    friends = await get_friends();
    await render_list(friends);
    for(let i = 0; i<3; i++){
        populate_friend(friends[i])
    }
}

function populate_friend(friend){
    const friend_id = friend["id"];
    let wrapper_div = get_element_by_id("block"+friend_id);
    get_element_by_id("image" + friend_id).src = friend.avatar;
    get_element_by_id("first_name" + friend_id).innerText = friend.first_name;
    get_element_by_id("last_name" + friend_id).innerText = friend.last_name;
    get_element_by_id("email" + friend_id).href = 'mailto:'+ friend.email;
    get_element_by_id("email" + friend_id).innerText = friend.email;
    wrapper_div.style.display = "flex";
}

function autocomplete() {
    let pagination_div = get_element_by_id('pagination_div');
    let button_number;
    pagination_div.childNodes.forEach((item)=>{
        if(item.classList.contains('active')){
            button_number = Number.parseInt(item.innerText);
        }
    });
    change_friends(button_number, get_element_by_id("autocomplete").value);
}

function filter_elements(filter){
    filter = filter.trim().toLowerCase();
    let founded= [];
    friends.forEach((friend)=>{
        if(is_include(friend["first_name"],filter)
            || is_include(friend["last_name"],filter)
            || is_include(friend["email"],filter)){
            founded.push(friend);
        }
    });
    return founded;
}

function is_include(attribute, filter){
    return attribute.toLowerCase().includes(filter);
}

function hide_all(){
    let friends_div = get_element_by_id('friends');
    friends_div.childNodes.forEach((friend)=>{
        friend.style.display = 'none';
    })
}

function change_friends(button_number, filter){
    hide_all();
    let elements = friends;
    if(filter !== ""){
        elements = filter_elements(filter);
    }
    let elementsCount = elements.length;
    if(Math.ceil(elementsCount/pagination_count) < button_number){
        button_number = Math.ceil(elementsCount/pagination_count);
    }
    let friends_div = get_element_by_id('friends');
    friends_div.appendChild(pagination(Math.ceil(elementsCount/pagination_count), button_number));
    for(let i=pagination_count*(button_number - 1); i<pagination_count*button_number; i++){
        if(elements[i] !== undefined) {
            populate_friend(elements[ i ]);
        }
    }
}

function pagination(count, buttonActive = 1){
    let pagination_div= get_element_by_id('pagination_div');
    if(pagination_div != null) {
        pagination_div.outerHTML="";
    }
    pagination_div = create_tag('div');
    pagination_div.id = 'pagination_div';
    for(let i=1; i<=count; i++){
        let button = create_tag('button');
        button.innerText = i;
        i == buttonActive  ? button.classList.add('active') : '';
        pagination_div.appendChild(button);
    }
    pagination_div.onclick = (event)=>{
        event.target.type === 'submit' ? change_friends(Number.parseInt(event.target.innerText), get_element_by_id("autocomplete").value) : event.stopPropagation();
    }
    return pagination_div;
}

function render_posts(url){
    get_data(url).then(response => {
        let posts_list = response;
        const user_id = 1;
        let posts = get_element_by_id('posts');
        for(let item in posts_list){
            if(posts_list[item].userId == user_id){
                let wrapper_div = create_tag('div');
                let title = create_tag('h3');
                title.innerText = posts_list[item].title;
                let post = create_tag('p');
                post.innerText = posts_list[item].body;
                wrapper_div.appendChild(title);
                wrapper_div.appendChild(post);
                posts.appendChild(wrapper_div);
            }
        }
    });
}

function change_main_photo(event) {
    let files = event.target.files;
    let file = files[0];
    if (file.type.match('image.*')) {
        let reader = new FileReader();
        reader.onload = (function() {
            return function(e) {
                get_element_by_id('main_profile_photo').src = e.target.result;
            };
        })(file);
        reader.readAsDataURL(file);
    }
}

function get_height_posts() {
    let client_height = document.documentElement.clientHeight;
    let about_profile_height = get_element_by_id('about_profile').scrollHeight;
    let tab_posts_for_height = get_element_by_id('tab_posts_for_height').scrollHeight;
    let all_indent = (parseInt(getComputedStyle(get_element_by_id('body'), true).padding)*2)+
        parseInt(getComputedStyle(get_element_by_id('about_profile'), true).marginBottom)+
        get_element_by_id('line_between_nav').scrollHeight+
        parseInt(getComputedStyle(get_element_by_id('tab_posts_for_height'), true).borderBottom);
    let posts_height = client_height-about_profile_height-all_indent-tab_posts_for_height;
    get_element_by_id('posts').style.height = posts_height+'px';
}

initialize();

