import { NextFunction, Request, Response } from 'express';
import BookService from '../services/BookService';

// Función para crear un libro nuevo
// Cogemos los datos que llegan en el body y los pasamos al servicio
const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookService.createBook(req.body);

        // Si se ha creado correctamente devolvemos el libro creado
        // El codigo 201 indica que se ha creado un recurso nuevo
        res.status(201).json({ book });
    } catch (error) {
        // Si ocurre algun error lo pasamos al siguiente middleware
        next(error);
    }
};

// Función para buscar un libro concreto usando su ID
const readBook = async (req: Request<{ bookId: string }>, res: Response, next: NextFunction) => {
    // Cogemos el ID del libro de los parametros de la URL
    const bookId = req.params.bookId;

    try {
        // Buscamos el libro usando el servicio
        const book = await BookService.getBookById(bookId);

        // Comprobamos si hemos encontrado el libro
        if (book) {
            // Si existe devolvemos sus datos
            res.status(200).json({ book });
        } else {
            // Si no existe devolvemos un error 404
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        // Si ocurre algun error lo pasamos al siguiente middleware
        next(error);
    }
};

// Función para obtener todos los libros
const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Pedimos al servicio la lista completa de libros
        const books = await BookService.getAllBooks();

        // Devolvemos los libros con un codigo 200
        res.status(200).json({ books });
    } catch (error) {
        // Si ocurre algun error lo pasamos al siguiente middleware
        next(error);
    }
};

// Función para modificar los datos de un libro
const updateBook = async (req: Request<{ bookId: string }>, res: Response, next: NextFunction) => {
    // Cogemos el ID del libro de los parametros de la URL
    const bookId = req.params.bookId;

    try {
        // Pasamos al servicio el ID y los nuevos datos del libro
        const book = await BookService.updateBook(bookId, req.body);

        // Comprobamos si el libro se ha encontrado y actualizado
        if (book) {
            // Si todo ha ido bien devolvemos el libro actualizado
            res.status(200).json({ book });
        } else {
            // Si no existe el libro devolvemos un error 404
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        // Si ocurre algun error lo pasamos al siguiente middleware
        next(error);
    }
};

// Función para eliminar un libro
const deleteBook = async (req: Request<{ bookId: string }>, res: Response, next: NextFunction) => {
    // Cogemos el ID del libro que queremos eliminar
    const bookId = req.params.bookId;

    try {
        // Llamamos al servicio para eliminar el libro
        const book = await BookService.deleteBook(bookId);

        // Comprobamos si el libro existia
        if (book) {
            // Si se ha eliminado correctamente devolvemos el codigo 204
            // Este codigo indica que la petición se ha realizado correctamente
            // pero no hay contenido que devolver
            res.status(204).send();
        } else {
            // Si no encontramos el libro devolvemos un error 404
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        // Si ocurre algun error lo pasamos al siguiente middleware
        next(error);
    }
};

// Funció per afegir un tag al llibre
// El tag arriba al body com { tag: "fantasia" }
const addTag = async (req: Request<{ bookId: string }>, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    const { tag } = req.body; // agafem el tag del body

    try {
        // Demanem al servei que afegeixi el tag
        const book = await BookService.addTag(bookId, tag);

        if (book) {
            // Retornem el llibre actualitzat amb els autors
            res.status(200).json({ book });
        } else {
            // El llibre no existia
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
};

// Funció per reemplaçar tots els tags del llibre
// Els nous tags arriben al body com { tags: ["novela", "historia"] }
const replaceTags = async (req: Request<{ bookId: string }>, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    const { tags } = req.body; // agafem la llista nova de tags

    try {
        // Demanem al servei que canviï tots els tags
        const book = await BookService.replaceTags(bookId, tags);

        if (book) {
            res.status(200).json({ book });
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
};

// Funció per eliminar un tag concret del llibre
// El tag arriba com a paràmetre de la URL: /books/:bookId/tags/:tag
const removeTag = async (req: Request<{ bookId: string; tag: string }>, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    const { tag } = req.params; // el tag ve de la URL, no del body

    try {
        // Demanem al servei que elimini el tag
        const book = await BookService.removeTag(bookId, tag);

        if (book) {
            res.status(200).json({ book });
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
};

// Exportamos todas las funciones para poder utilizarlas en las rutas
export default { createBook, readBook, readAll, updateBook, deleteBook, addTag, replaceTags, removeTag };
