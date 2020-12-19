var dbobject
document.addEventListener('DOMContentLoaded', async function () {//replaced DOMContentLoaded event
    const database = firebase.database();
    dbobject = (await database.ref('/').once('value')).val()
    loadinputs(dbobject)

});

function loadinputs(dbobject) {
    console.trace("loading inputs?????")
    const compSelector = document.querySelector("#compselector")
    for (computer in dbobject) {
        console.log(computer)
        compSelector.innerHTML += `<input onclick ="loadGraph('${computer}')" "id = "${computer}" type="radio" name="compselect" value = "${computer}"> <label for="${computer}">${computer}</label><br>`
    }

}