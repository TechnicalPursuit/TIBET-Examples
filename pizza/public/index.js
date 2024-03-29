window.addEventListener(
'load',
function() {
    if (window.TP && TP.boot) {
        TP.boot.launch();
        return;
    }

    //  If TP isn't real it means tibet_loader wasn't found. Try to notify about
    //  that in a reasonable fashion so the UI doesn't just look hung.
    if (top.UIBOOT && top.UIBOOT.contentDocument) {
        top.UIBOOT.contentDocument.getElementById('BOOT-IMAGE').src =
            './TIBET-INF/boot/media/alert.png';
        top.UIBOOT.contentDocument.getElementById('BOOT-SUBHEAD').innerHTML =
            'Error loading. Was the project initialized via `tibet init`?';
    }
},
false);
