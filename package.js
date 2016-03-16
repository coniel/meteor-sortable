Package.describe({
    name: "coniel:sortable",
    summary: "A package to pin things",
    version: "0.0.1",
    git: "https://github.com/coniel/pinnable.git"
});

Package.onUse(function(api) {
    api.versionsFrom("1.2");

    api.use([
        "coniel:can@0.1.0",
        "coniel:base-model@0.3.0",
        "mdg:validated-method@1.0.1",
        "didericis:callpromise-mixin@0.0.1",
        "tunifight:loggedin-mixin@0.1.0",
        "ecmascript",
        "es5-shim"
    ]);
    api.imply("coniel:base-model");

    //Add the friend-model files
    api.addFiles("sortable-model.js");


    api.export(["SortableModel"]);
});