const books = [];
const RENDER_EVENT = 'render-book';


document.addEventListener('DOMContentLoaded', function () {
    const submitBook = document.getElementById('inputBook');
    submitBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    document.getElementById('searchBook').addEventListener('submit', function (event) {
        event.preventDefault();
        searchBook();

    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const titleBook = document.getElementById('inputBookTitle').value;
    const authorBook = document.getElementById('inputBookAuthor').value;
    const yearBook = document.getElementById('inputBookYear').value;
    const isCompleteBook = document.getElementById('inputBookIsComplete').checked;

    const isCompleted = isCompleteBook ? true : false;
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, isCompleted);

    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}


function generateId() {
    return +new Date();
}


function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}



document.addEventListener(RENDER_EVENT, function () {

    console.log(books);

    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBookList(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBookList.appendChild(bookElement);
        } else {
            completedBookList.appendChild(bookElement);
        }
    }
});


function makeBookList(bookObject) {
    const bookListImg = document.createElement('img');
    bookListImg.setAttribute('src', './img/books.png');
    bookListImg.setAttribute('alt', 'books');
    bookListImg.setAttribute('width', '70');
    bookListImg.style.marginBottom = '5px';

    const booklist = document.createElement('h3');
    booklist.classList.add('list');
    booklist.innerHTML = `${bookObject.title}`;

    const booklist2 = document.createElement('p');
    booklist2.innerText = `Penulis: ${bookObject.author}`;

    const booklist3 = document.createElement('p');
    booklist3.innerText = `Tahun: ${bookObject.year}`;

    const booklist4 = document.createElement('div');
    booklist4.className = 'action';

    const booklist5 = document.createElement('article');
    booklist5.style.margin = '40px 10px 10px ';
    booklist5.style.background = 'rgba(255, 255, 255, .1)';
    booklist5.style.borderRadius = '5px';
    booklist5.style.padding = '20px';
    booklist5.style.boxShadow = '0 1rem 2rem rgba(0, 0, 0, 0.2)';
    booklist5.style.border = '1px solid rgba(179, 175, 175, .2)';
    booklist5.style.color = 'rgb(232, 240, 254)';
    booklist5.style.display = 'flex';
    booklist5.style.flexDirection = 'column';
    booklist5.style.alignItems = 'center';
    booklist5.style.transform = 'scale(1, 1)';
    booklist5.classList.add('book-item');
    booklist5.appendChild(bookListImg);
    booklist5.appendChild(booklist);
    booklist5.appendChild(booklist2);
    booklist5.appendChild(booklist3);
    booklist5.appendChild(booklist4);

    function mouseOver() {
        booklist5.style.transform = 'scale(1.1, 1.1)';
    }

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('yellow');
        undoButton.innerText = 'Uread';
        undoButton.style.backgroundColor = 'yellow';
        undoButton.style.color = 'green';
        undoButton.style.border = '0';
        undoButton.style.padding = '5px';
        undoButton.style.margin = '0 3px 0 0';
        undoButton.style.borderRadius = '5px';
        undoButton.style.cursor = 'pointer';

        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        });

        booklist4.appendChild(undoButton);

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Delete';
        trashButton.style.backgroundColor = 'red';
        trashButton.style.color = 'rgb(232, 240, 254)';
        trashButton.style.border = '0';
        trashButton.style.padding = '5px';
        trashButton.style.margin = '3px 0 0 0';
        trashButton.style.borderRadius = '5px';
        trashButton.style.cursor = 'pointer';

        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });

        booklist4.appendChild(trashButton);

    } else {
        const completeButton = document.createElement('button');
        completeButton.classList.add('green');
        completeButton.innerText = 'Read';
        completeButton.style.backgroundColor = 'green';
        completeButton.style.color = 'rgb(232, 240, 254)';
        completeButton.style.border = '0';
        completeButton.style.padding = '5px';
        completeButton.style.margin = '0 3px 0 0';
        completeButton.style.borderRadius = '5px';
        completeButton.style.cursor = 'pointer';

        completeButton.addEventListener('click', function () {
            completeBook(bookObject.id);
        });

        booklist4.appendChild(completeButton);

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Delete';
        trashButton.style.backgroundColor = 'red';
        trashButton.style.color = 'rgb(232, 240, 254)';
        trashButton.style.border = '0';
        trashButton.style.padding = '5px';
        trashButton.style.borderRadius = '5px';
        trashButton.style.cursor = 'pointer';

        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });

        booklist4.appendChild(trashButton);
    }

    return booklist5;
}

function completeBook(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}



function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser tidak support local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const seializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(seializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBook() {
    const inputSearch = document.getElementById("searchBookTitle").value;
    const listBook = document.querySelectorAll(".list")

    for (list of listBook) {
        if (inputSearch !== list.innerText) {
            console.log(list.innerText)
            list.parentElement.style.display = 'none';
        }
    }
}