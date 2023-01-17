//Create book
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//Create UI : Handles UI Tasks
class UI{
   static displayBooks(){
    const books = Store.getBooks();

    books.forEach((book) => UI.addbookToList(book))
   }
   static addbookToList(book){
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;
    list.appendChild(row);   
}
    static deleteBook(el){
        if (el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className){
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('.form');
        container.insertBefore(div, form);
        //gone in 3 sec.
        setTimeout(()=> document.querySelector('.alert').remove(), 3000)
    }

    static clearForm(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value= '';
        document.querySelector('#isbn').value = '';
    }
}

//Store Class : Storage
    class Store{
        static getBooks(){
            let books;
            if (localStorage.getItem('books') === null){
                books = [];
            } else {
                books = JSON.parse(localStorage.getItem('books'));
            }
            return books;
        }
        static addBook(book){
            const books = Store.getBooks();
            books.push(book);
            localStorage.setItem('books', JSON.stringify(books))
        }
        static removeBook(isbn){
            const books = Store.getBooks();

            books.forEach((book, index) => {
                if (book.isbn === isbn){
                    books.splice(index, 1);
                }
            });
            localStorage.setItem('books', JSON.stringify(books));
        }

    }

//Event: display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) =>{
    // Prevent Actual submit
    e.preventDefault();

    // getting the for values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    //Validation
    if (title === "" ||
        author === ''||
        isbn === '') {UI.showAlert("please fill all the fields", "danger")

        } else {
            //instantiate book
            const book = new Book(title, author, isbn);
        
            //Add book to UI
            UI.addbookToList(book);
                
            //Add book to store
            Store.addBook(book);

            //Show success message
            UI.showAlert("Book added!", "success");
        
            //Clear Form
            UI.clearForm();
        }


})

//Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert("Book deleted!", "success");
})