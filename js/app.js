'use strict'; // Строгий режим

// инициализируем переменную, содержащую одно значение пустого массива
let allUsers = [];
let usersToShow = [];

// Document метод querySelector() возвращает первый элемент ( Element ) документа,
// который соответствует указанному селектору или группе селекторов.
let button = document.querySelector('.js-button'); // Кнопка "Загрузить пользователей" по клику на кнопку.
let preloader = document.querySelector('.preloader'); // Анимационный прелоадер загрузки.
let title = document.querySelector('.title'); // Заголовок
let search = document.querySelector('.search'); // Поиск
let sorting = document.querySelector('.sort'); // Сортировка
let pagination = document.querySelector('.content-pagination'); // Пагинация

const searchForm = document.querySelector('.search__form'); // Форма
const searchInput = document.querySelector('.search__input'); // Фильтр поиск (одно поле)
const searchResetButton = document.querySelector('.search__reset'); // Очистка фильтра

// Регистрируем обработчик события 'submit' для элемента <form>
searchForm.addEventListener('submit', (e) => {

    e.preventDefault(); // отменяем действие события по умолчанию

    // Метод trim () удаляет пробелы с обеих сторон строки
    // Метод toLowerCase () преобразует строку в строчные буквы.
    const query = searchInput.value.trim().toLowerCase();

    // Метод includes() позволяет определить, содержит ли массив искомый элемент. В случае нахождения
    // элемента метод возвращает логическое значение true, в обратном случае false.

    // Создание списка поиска по ФИО, номеру телефона, email-лу.
    if (query) {
        usersToShow = allUsers.filter(user => {
            return user.name.first.toLowerCase().includes(query)
                || user.name.last.toLowerCase().includes(query)
                || user.phone.includes(query)
                || user.email.toLowerCase().includes(query)
        });

        currentPage = 1;

        renderUsers();
        renderPagination();
    }

});

// Фильтр поиска одно поле searchInput
searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val) {
        searchResetButton.classList.add('active'); // Добавляет элемент указанные классы
    } else {
        searchResetButton.classList.remove('active'); // Удаляет элемент указанные классы
    }
});

// Очистка фильтра searchResetButton
searchResetButton.addEventListener('click', () => {
    // Свойство value устанавливает или возвращает значение атрибута value текстового поля
    searchInput.value = '';
    usersToShow = allUsers;
    currentPage = 1;
    renderUsers();
    renderPagination();
});

// Сортировка списка
const sortForm = document.querySelector('.sort__form'); // Сортировка в форме
const azSortSelect = document.getElementById('az_sort'); // Сортировка по алфавиту
const genderSortSelect = document.getElementById('gender_sort'); // Сортировка по половому признаку
const resetSortButton = document.getElementById('sort_reset'); // Кнопка "Сбросить"

// Регистрируем обработчик события 'submit' для элемента <form>
sortForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const azSort = +azSortSelect.value; // инициализируем переменную, содержащую одно значение алфавита
    const genderSort = +genderSortSelect.value; // инициализируем переменную, содержащую одно значение пол

    let users = [...allUsers];

    // Оператор if(алфавит или пол)
    if (azSort || genderSort) {
        // Оператор if(алфавит)
        if (azSort) {
            users.sort((a, b) => {
                if (a.name.first > b.name.first) { // a, если значение больше b
                    return azSort;
                };
                if (a.name.first < b.name.first) { // a, если значение меньше b
                    return -azSort;
                };
                if (a.name.first === b.name.first) { // a, если значение равно b
                    if (a.name.last > b.name.last) { // a, если значение больше b
                        return azSort;
                    };
                    if (a.name.last < b.name.last) { // a, если значение меньше b
                        return -azSort;
                    };
                }
                return 0;
            });
        }

        // Оператор if(пол)
        if (genderSort) {
            users.sort((a, b) => {
                if (a.gender === b.gender) { // a, если значение равно b
                    return 0;
                }
                return a.gender === 'male' && b.gender === 'female' ? -genderSort : genderSort;
            });
        }

    }

    // Статический фильтр по половому признаку Мужчина и Женщина
    const genderFilter = document.querySelector('input[name=gender_filter]:checked').value;

    if (genderFilter !== 'none') {
        if (genderFilter === 'male') {
            users = users.filter(user => user.gender === 'male');
        }
        if (genderFilter === 'female') {
            users = users.filter(user => user.gender === 'female');
        }
    }

    // Статический фильтр по возрасту
    const ageFilter = document.querySelector('input[name=age_filter]:checked').value;

    if (ageFilter !== 'none') {
        users = users.filter(user => {

            const {age} = user.dob;

            switch (ageFilter) {
                case '<35':
                    return age < 35;
                case '35-40':
                    return age >= 35 && age < 40;
                case '40-45':
                    return age >= 40 && age <= 45;
                case '>45':
                    return age > 45;
                default:
                    return true;
            }
        });
    }

    usersToShow = users;
    currentPage = 1;

    renderUsers();
    renderPagination();

    return false;
});


// Кнопка "Сбросить"
resetSortButton.addEventListener('click', () => {
    sortForm.reset();
    usersToShow = allUsers;
    currentPage = 1;
    renderUsers();
    renderPagination();
});

// click – происходит, когда кликнули на элемент левой кнопкой мыши (на устройствах с сенсорными экранами оно происходит при касании).
button.addEventListener('click', renerator); // Кнопка click на элемент левой кнопкой мыши загрузки страницы renerator

let currentPage = 1;
let totalPages = 4; 
let perPage = 10; // кол-ва записей для отображения 

function renerator() { // Начало функции renerator

    // Ваш код для обработки данных, которые вы получаете от API
    let url = 'https://randomuser.me/api/?results='; // Получить случайных пользователей
    let quantity = Math.floor(Math.random() * 101);  // Результат случайное целое число от 0 до 100
    let randomUsers = `${url}${quantity}`; // генерироваться случайных пользователей общие

    // Свойство classList – это объект для работы с классами.
    // Метод add добавляет указанный класс: элемент.classList.add('класс');
    button.classList.add('hidden'); // после загрузки кнопка спрятана
    preloader.classList.add('visible'); // нажимает на кнопку после прелоадер загрузки
    title.classList.add('active'); // нажимает на кнопку загрузки после появляется заголовок
    search.classList.add('active'); // нажимает на кнопку загрузки после появляется поиск
    sorting.classList.add('active'); // нажимает на кнопку загрузки после появляется сортировка
    pagination.classList.add('active'); // нажимает на кнопку загрузки после появляется пагинация

    let myRequest = new XMLHttpRequest(); // Создаём новый объект XMLHttpRequest
    myRequest.open('GET', randomUsers, true); // Конфигурируем его: GET-запрос на URL 'randomUsers'
    myRequest.responseType = 'json'; // Указываем тип данных, ожидаемых в ответе
    myRequest.onreadystatechange = function () { // Начало функции onreadystatechange

        // Функция в свойстве onreadystatechange вызывается каждый раз, когда изменяется свойство readyState.
        // Когда в свойстве readyState установлено значение 4, а в свойстве status – 200, ответ сервера готов
        if (myRequest.readyState === 4 && myRequest.status === 200) {

            // Прелоадер до загрузки страницы
            preloader.classList.remove('visible');

            allUsers = myRequest.response.results; // Получить результаты
            usersToShow = allUsers;

            renderUsers();
            renderSummary();
            renderPagination();

        }
    };// Конец функции onreadystatechange
    myRequest.send(null); // Отсылаем запрос
} // Конец функции renerator


// кнопка Показать еще
const showMoreButton = document.querySelector('.show-more__button');

showMoreButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
        currentPage++;
        renderUsers(true);
        setActiveButton();
        if (currentPage === totalPages) {
            showMoreButton.style.display = 'none';
        }
    }
});

// Реализовать пагинацию данных
function renderPagination() {
    totalPages = Math.ceil(usersToShow.length / perPage);

    console.log(totalPages);

    const paginationWrapper = document.getElementById('pagination_wrapper'); 
    if (totalPages <= 1) {
        showMoreButton.style.display = 'none';
        paginationWrapper.innerHTML = '';
        return;
    }

    showMoreButton.style.display = 'block';

    let pages = '';

    for (let page = 1; page <= totalPages; page++) {
        pages += `<li class="pagination__item ${page === currentPage ? 'active' : ''}"><a href="#" class="pagination__link" data-goto="${page}">${page}</a></li>`
    }

    const begin = `<li class="pagination__item"><a href="#" class="pagination__link" data-goto="first">Начало</a></li>`;
    const end = `<li class="pagination__item"><a href="#" class="pagination__link" data-goto="last">Конец</a></li>`;

    const next = `
        <li class="pagination__item">
            <a href="#" class="pagination__link pagination__next disabled" title="Cледующая" data-goto="next">
                <svg class="pagination__icon" viewBox="0 0 492 492">
                    <use xlink:href="img/sprite.svg#icon-angle-left"></use>
                </svg>
            </a>
        </li>
    `;

    const prev = `
        <li class="pagination__item">
            <a href="#" class="pagination__link pagination__prev" title="Предыдущая" data-goto="prev">
                <svg class="pagination__icon" viewBox="0 0 492 492">
                    <use xlink:href="img/sprite.svg#icon-angle-right"></use>
                </svg>
            </a>
        </li>
    `;

    paginationWrapper.innerHTML = `
        <ul class="pagination__list">
            ${begin}
            ${next}
            ${pages}
            ${prev}
            ${end}
        </ul>
    `;

}

function getCurrentPageItems() {
    return getUsersForPage(currentPage);
}

function getUsersForPage(page) {
    const offset = (page - 1) * perPage;
    return usersToShow.slice(offset).slice(0, perPage);
}

document.addEventListener('click', (e) => {

    const btn = e.target.closest('[data-goto]');

    if (btn) {
        e.preventDefault();

        const goto = btn.dataset.goto;

        if (goto === 'first') {
            currentPage = 1;
        }

        if (goto === 'last') {
            currentPage = totalPages;
        }

        if (goto === 'next') {
            if (currentPage === 1) {
                return;
            }
            currentPage = currentPage - 1;
        }

        if (goto === 'prev') {
            if (totalPages === currentPage) {
                return;
            }
            currentPage = currentPage + 1;
        }

        if (!isNaN(+goto)) {
            currentPage = +goto;
        }

        setActiveButton();

        renderUsers();

        if (currentPage === totalPages) {
            showMoreButton.style.display = 'none';
        } else {
            showMoreButton.style.display = 'block';
        }

    }
});

function setActiveButton() {
    const buttons = document.querySelectorAll('.pagination__item');

    buttons.forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = document.querySelector(`a[data-goto="${currentPage}"]`).closest('.pagination__item');
    activeButton.classList.add('active');
}


function renderUsers(append = false) { // Начало функции renderUser

    const detailsEl = document.querySelector('.details');

    let detailsFragment = document.createDocumentFragment(); // fragment это ссылка на пустой объект DocumentFragment

    const users = getCurrentPageItems();

    users.forEach(function (author) { // forEach через результаты и для каждого запуска приведенный ниже код

        // Построить сетку из карточек пользователей.

        // Методы для создания узлов: document.createElement(tag) – создаёт элемент с заданным тегом
        // element.setAttribute(name, value); - устанавливает атрибут
        //  name - имя атрибута (строка).
        //  value  - значение атрибута.

        let card = document.createElement('div'); // создаем новый элемент div
        card.classList.add('card'); // создаем новый класс card

        // Изображение.
        let cardimages = document.createElement('div'); // создаем новый элемент div
        cardimages.classList.add('card__img'); // создаем новый класс card__img
        card.appendChild(cardimages); // append вставить cardimages в конец card

        let cardphoto = document.createElement('img'); // создаем новый элемент img
        cardphoto.classList.add('card__photo'); // создаем новый класс card__photo
        cardphoto.setAttribute('src', author.picture.large); // Добавьте источник изображения, чтобы быть источником атрибут src
        cardphoto.setAttribute('alt', 'user photo'); // создаем новый атрибут alt устанавливает альтернативный текст 'user photo'
        cardimages.appendChild(cardphoto); // append вставить cardphoto в конец cardimages

        // Имя выводить в формате ФИО.
        let cardname = document.createElement('div'); // создаем новый элемент div
        cardname.classList.add('card__name'); // создаем новый класс card__name
        cardname.innerHTML = `${author.name.title} ${author.name.first} ${author.name.last}`; // установка содержимого для элемента
        card.appendChild(cardname); // append вставить cardname в конец card

        // Пол.
        let cardgender = document.createElement('div'); // создаем новый элемент div
        cardgender.classList.add('card__gender'); // создаем новый класс card__gender
        cardgender.innerHTML = `${author.gender}`; // установка содержимого для элемента
        card.appendChild(cardgender); // append вставить cardgender в конец card

        // Номер телефона.
        let cardphone = document.createElement('div'); // создаем новый элемент div
        cardphone.classList.add('card__phone'); // создаем новый класс card__phone
        cardphone.innerHTML = `${author.phone}`; // установка содержимого для элемента
        card.appendChild(cardphone); // append вставить cardphone в конец card

        // Электронная почта - gmail.
        let cardemail = document.createElement('div'); // создаем новый элемент div
        cardemail.classList.add('card__email'); // создаем новый класс card__email
        cardemail.innerHTML = `${author.email}`; // установка содержимого для элемента
        card.appendChild(cardemail); // append вставить cardemail в конец card

        // Адрес (Область, Город, Улица, Дом).
        let cardlocation = document.createElement('div'); // создаем новый элемент div
        cardlocation.classList.add('card__location'); // создаем новый класс card__location
        cardlocation.innerHTML = `${author.location.state}, ${author.location.city}, ${author.location.street.name}, ${author.location.street.number}`; // установка содержимого для элемента
        card.appendChild(cardlocation); // append вставить cardlocation в конец card

        // Вывести дату рождения.
        let carddob = document.createElement('div'); // создаем новый элемент div
        carddob.classList.add('card__dob'); // создаем новый класс card__dob
        carddob.innerHTML = `<span>Date of birth:</span> ${new Date(author.dob.date).toLocaleDateString()}`; // установка содержимого для элемента
        card.appendChild(carddob); // append вставить carddob в конец card

        // Вывести дату регистрации.
        let cardregistered = document.createElement('div'); // создаем новый элемент div
        cardregistered.classList.add('card__registered'); // создаем новый класс card__registered
        cardregistered.innerHTML = `<span>Date of registration:</span> ${new Date(author.registered.date).toLocaleDateString()}`; // установка содержимого для элемента
        card.appendChild(cardregistered); // append вставить cardregistered в конец card

        detailsFragment.appendChild(card); // append вставить card в конец detailsFragment

    });

    if (!append) {
        detailsEl.innerHTML = ''
    }

    detailsEl.appendChild(detailsFragment);

} // Конец функции renderUsers

const renderSummary = () => {

    // Объявление cуществует 3 варианта синтаксиса для создания пустого массива:
    let men = []; // men - создаём массив
    let women = []; // women - создаём массив
    let nat = []; // nat - создаём массив

    allUsers.forEach(user => {
        // Мужчин и женщин
        if (user.gender === 'male') { // Оператор if(...)
            men.push(user); // Метод push() добавляет один или более элементов в конец массива и возвращает новую длину массива.
        } else {
            women.push(user);
        }

        // Hациональности
        nat.push(user.nat);
    });

    let common = document.createElement('div'); // создаем новый элемент div
    common.classList.add('application'); // создаем новый класс application

    // Вывести общее кол-во пользователей в ответе
    let applicationamount = document.createElement('div'); // создаем новый элемент div
    applicationamount.classList.add('application__amount'); // создаем новый класс application__amount
    applicationamount.innerHTML = `Total Users: ${allUsers.length}`; // установка содержимого для элемента
    common.appendChild(applicationamount); // append вставить applicationamount в конец common

    // Вывести кол-во мужчин
    let resultsman = document.createElement('div'); // создаем новый элемент div
    resultsman.classList.add('application__man'); // создаем новый класс application__man
    resultsman.innerHTML = `Total male users: ${men.length}`; // установка содержимого для элемента
    common.appendChild(resultsman); // append вставить resultsman в конец common

    // Вывести кол-во женщин
    let resultswomen = document.createElement('div'); // создаем новый элемент div
    resultswomen.classList.add('application__women'); // создаем новый класс application__women
    resultswomen.innerHTML = `Total women users: ${women.length}`; // установка содержимого для элемента
    common.appendChild(resultswomen); // append вставить resultswomen в конец common

    // Вывести текст, кого больше: мужчин или женщин
    let resultscomparison = document.createElement('div'); // создаем новый элемент div
    resultscomparison.classList.add('application__comparison'); // создаем новый класс application__comparison
    common.appendChild(resultscomparison); // append вставить resultscomparison в конец common

    // Оператор if(...)
    if (men.length > women.length) {  // men, если значение больше women
        resultscomparison.innerHTML = 'More: men'; // установка содержимого для элемента
    } else if (men.length < women.length) { // men, если значение меньше women
        resultscomparison.innerHTML = 'More: women'; // установка содержимого для элемента
    } else if (men.length == women.length) { // men, если значение равно women
        resultscomparison.innerHTML = 'Equally: Men and women'; // установка содержимого для элемента
    }

    // Посчитать кол-во человек по совпадающим национальностях
    let applicationhationalities = document.createElement('div'); // создаем новый элемент div
    applicationhationalities.classList.add('application__hationalities'); // создаем новый класс application__hationalities
    common.appendChild(applicationhationalities); // append вставить applicationphone в конец common

    let object = []; // object - создаём массив

    nat.forEach(function (value) {
        object[value] = object[value] + 1 || 1;
    });

    let codesFragment = document.createDocumentFragment(); // fragment это ссылка на пустой объект DocumentFragment

    // Циклы for
    for (let value in object) {
        // ... тело цикла ...
        let applicationcountry = document.createElement('div'); // создаем новый элемент div
        applicationcountry.classList.add('application__country'); // создаем новый класс application__country
        applicationcountry.innerHTML = `${value} - ${object[value]} ${object[value] == 1 ? 'user' : 'useru'}`; // установка содержимого для элемента
        codesFragment.appendChild(applicationcountry); // append вставить applicationcountry в конец codesFragment
    }

    applicationhationalities.appendChild(codesFragment); // append вставить codesFragment в конец applicationhationalities

    const resultEl = document.querySelector('.result');

    resultEl.innerHTML = '';

    resultEl.appendChild(common);
}