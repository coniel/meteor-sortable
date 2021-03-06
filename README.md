Sortable
========

A package enabling the sorting of models by adding a position attribute. The
package takes care of updating the position of other related models (based on
the linkedObjectId or other specified attribute) when a new model is added, a
model is removed or the position of a model changes.

### Static Methods

**SortableModel.makeSortable(model, typeAsString, options)** - Make a model
sortable

### Prototypal Methods

**SortableModel.prototype.changePosition** - Change the position of a model (use
this to update the position of a model so that other related models are updated
accordingly).

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ javascript
var Todo = BaseModel.extendAndSetupCollection("todos");

UploadableModel.makeUploadable(Todo, "todo", {linkedOnbjectIdKey
 : "listId"});

var todo = Todo.collection.findOne({position: 5});new Todo({listId: "h3uh532hhrd43d", label: 'Wash the car', done: false, position: 5}).save();

todo.changePosition(1);
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
