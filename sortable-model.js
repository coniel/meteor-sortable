SortableModel = {
    options: {}
};

var sortableMethods = {
    changePosition(newPosition) {
        this._meteorMethods.changePosition.callPromise({_id: this._id, position: newPosition});
    }
};

SortableModel.makeSortable = function(model, type, options) {

    options = options || {};

    _.extend(model.prototype, sortableMethods);

    var positionSchema = {
        type: Number,
        optional: true
    };

    positionSchema.min = options.startAtZero? 0 : 1;

    if (options.auto) {
        positionSchema.autoValue = function() {
            if (this.isInsert) {
                var query = {};
                var linkedObjectIdKey = options.linkedOnbjectIdKey || 'linkedObjectId';
                query[linkedObjectIdKey] = this.field(linkedObjectIdKey).value;

                return model.collection.find(query).count() + 1;
            }
        };
    }

    model.appendSchema({
        "position": positionSchema
    });

    model._meteorMethods.changePosition = new ValidatedMethod({
        name: type + '.changePosition',
        mixins: [CallPromiseMixin, LoggedInMixin],
        validate: model.getSubSchema(["_id", "position"], null, true),
        checkLoggedInError: {
            error: 'notLogged',
            message: 'You need to be logged in to call this method',//Optional
            reason: 'You need to login' //Optional
        },
        run({_id, position}) {
            var object = model.collection.findOne({_id: _id});
            // Get the parent object
            var parent;
            if (typeof object.linkedObject === 'function') {
                parent = object.linkedObject();
            }

            if (parent) {
                // object type and id to validate against
                var checkOnType = object.linkedObjectType;
                var checkOnId = parent._id;

                if (parent.linkedObjectType && parent.linkedObjectId) {
                    if (!SortableModel.options[checkOnType] || (SortableModel.options[checkOnType] && !!SortableModel.options[checkOnType].authorizeOnGrandParent)) {
                        // If the linked object has a prent, validate against the parent
                        checkOnType = parent.linkedObjectType;
                        checkOnId = parent.linkedObjectId;
                    }
                }
            }

            var checkType = type;

            if (options.checkType) {
                if (options.checkType === 'composite') {
                    var parentType = parent? parent._objectType : null;
                    checkType = parentType + type.charAt(0).toUpperCase() + type.slice(1);
                } else {
                    checkType = object[options.checkType];
                }
            }

            if (Can.updateIn(checkType, object, checkOnType, checkOnId)) {
                if (position < object.position) { // Object moved up the list
                    return model.collection.update(
                        { linkedObjectId: parent._id, position: { $gte: position, $lt: object.position } },
                        { $inc: { position: 1 } },
                        { multi: true }, () => {
                            model.collection.update({_id: _id}, {$set: {position: position}})
                        });
                } else if (position > object.position) { // Object moved down the list
                    return model.collection.update(
                        { linkedObjectId: parent._id, position: { $gt: object.position, $lte: position } },
                        { $inc: { position: -1 } },
                        { multi: true }, () => {
                            model.collection.update({_id: _id}, {$set: {position: position}})
                        });
                }
            }
        }
    });
};

Can.addPermissionType("pin");