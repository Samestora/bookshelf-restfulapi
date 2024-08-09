const { nanoid } = require("nanoid");
const bookArr = require("./books");

const getAllBooksHandler = (request,h) => {
    const {name, reading , finished} = request.query;
    let temp = bookArr;
    let books = [];

    switch (reading){
        case '1':
            temp = bookArr.filter((books) => books.reading === true);
            break;
        case '0':
            temp = bookArr.filter((books) => books.reading === false);
            break;
    }

    switch (finished){
        case '1':
            temp = bookArr.filter((books) => books.finished ===  true);
            break;
        case '0':
            temp = bookArr.filter((books) => books.finished === false);
            break;
    }
    
    if (name){
        temp = bookArr.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

        books = temp.map((book) => ({
            id: book.id,
            name: book.id,
            publisher: book.publisher,
        }));
        const response = h.response({
            status:'success',
            data:{
                books,
            },
        });
        return response;
    }

    // Books filter last time
    books = temp.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));
    
    const response = h.response({
        status:'success',
        data: {
            books,
        },
    });
    return response;
};

const addBookHandler = (request, h) => {
    const {name,year ,author,summary, publisher,pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    let finished = false;
    
    if (pageCount === readPage){
        finished = true;
    }

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };
    
    
    if (!name){
        const response = h.response({
            status:'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        
        response.code(400);
        return response;
    }
    else if(readPage>pageCount){
        const response = h.response({
            status:'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);
        return response;
    }

    bookArr.push(newBook);

    const isSuccess = bookArr.filter((bookArr) => bookArr.id === id).length > 0;
    if (isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        
        response.code(201);
        return response;
    };
    
    const response = h.response({
        status:'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
}

const getBookByIdHandler = (request, h) => {
    const {id} = request.params;

    const book = bookArr.filter((n) => n.id === id)[0];

    if (book !== undefined){
        return {
            status: 'success',
            data: {
                book,
            }
        };
    }

    // Default
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
}; 

const editBookByIdHandler = (request, h) => {
    const {id} = request.params;

    const {name,year,author,summary,publisher,pageCount,readPage,reading} = request.payload;
    const updatedAt = new Date().toISOString();

    const index = bookArr.findIndex((book) => book.id === id);

    if(!name){
        const response = h.response({
            status:'fail',
            message:'Gagal memperbarui buku. Mohon isi nama buku',
        });

        response.code(400);
        return response;
    }

    if(readPage > pageCount){
        const response = h.response({
            status:'fail',
            message:'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        
        response.code(400);
        return response;
    }

    if(index !== -1){
        bookArr[index] = {
            ...bookArr[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            reading,
            readPage,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    // Default
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

const deleteBookByIdHandler = (request, h) => {
    const {id} = request.params;

    const index = bookArr.findIndex((book) => book.id === id);

    if (index !== -1){
        bookArr.splice(index, 1);
        
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;    
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};
