# LOG

Aquest document és la bitàcola del projecte: serveix per registrar el que s'ha fet
i quins prompts d'IA s'han fet servir per fer-ho.

---

## Eina i model d'IA utilitzat

- **Eina:** Google Gemini
- **Model:** Gemini 2.0 Flash

---

## Referències consultades

- Documentació oficial de Mongoose: https://mongoosejs.com/docs/api/query.html
- Documentació oficial de Joi: https://joi.dev/api
- Documentació oficial d'Express: https://expressjs.com/en/4x/api.html

---

## Registre d'usos de la IA

---

### Ús 1

**Prompt literal:**
> "Com puc afegir un tag a un array de MongoDB sense duplicar-lo?"

**Resposta de la IA:**
Va explicar l'operador `$addToSet` de MongoDB, que afegeix un element a un array només si no hi és ja, i va mostrar com fer-ho amb `findByIdAndUpdate`.

**Incoherències detectades:**
Cap incoherència. La resposta era correcta i directa.

**Solució/adaptació manual:**
Es va afegir `.populate('authors')` al final de la crida per retornar també les dades dels autors, tal com fan la resta de funcions del servei.

---

### Ús 2

**Prompt literal:**
> "Com puc reemplaçar tots els tags d'un document de MongoDB per una llista nova?"

**Resposta de la IA:**
Va suggerir usar `$set: { tags }` dins de `findByIdAndUpdate` per sobreescriure el camp sencer.

**Incoherències detectades:**
La IA inicialment va proposar usar `{ tags: newTags }` directament (sense `$set`), cosa que pot tenir comportaments inesperats amb Mongoose en mode strict.

**Solució/adaptació manual:**
Es va canviar explícitament a `{ $set: { tags } }` per ser més clar i evitar problemes amb futures versions de Mongoose.

---

### Ús 3

**Prompt literal:**
> "Com puc eliminar un element concret d'un array en MongoDB?"

**Resposta de la IA:**
Va explicar l'operador `$pull`, que elimina d'un array tots els elements que coincideixin amb el valor donat.

**Incoherències detectades:**
Cap incoherència. L'operador `$pull` és exactament el que calia.

**Solució/adaptació manual:**
Cap adaptació necessària. Es va aplicar directament: `{ $pull: { tags: tag } }`.

---

### Ús 4

**Prompt literal:**
> "Com valido amb Joi que un camp sigui un string i que el seu valor estigui dins d'una llista concreta?"

**Resposta de la IA:**
Va mostrar l'ús de `Joi.string().valid(...arrayDeValors).required()` per restringir els valors acceptats.

**Incoherències detectades:**
La IA va posar els valors directament a mà a l'exemple (`Joi.string().valid('a', 'b', 'c')`), però al projecte ja existia la constant `BOOK_TAGS` exportada des del model.

**Solució/adaptació manual:**
Es va usar l'spread operator per passar la constant: `Joi.string().valid(...BOOK_TAGS)`, reutilitzant la font única de veritat del model.

---

### Ús 5

**Prompt literal:**
> "On ha d'anar la validació del tag quan es fa un DELETE per URL i no per body?"

**Resposta de la IA:**
Va explicar que quan el valor ve per paràmetre d'URL no es pot validar amb el middleware de Joi (que valida el body), i que es pot validar manualment al controlador o simplement deixar que `$pull` no faci res si el tag no existeix.

**Incoherències detectades:**
La IA va suggerir afegir una validació manual al controlador per retornar 422 si el tag no és vàlid, però això afegia complexitat innecessària.

**Solució/adaptació manual:**
Es va decidir no validar el tag de la URL, ja que `$pull` és idempotent: si el tag no existia, simplement no fa res i es retorna el llibre igual. Comportament acceptable i consistent amb l'API REST.
