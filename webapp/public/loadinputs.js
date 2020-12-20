var dbobject
document.addEventListener('DOMContentLoaded', async function () {//replaced DOMContentLoaded event
    const database = firebase.database();
    dbobject = (await database.ref('/').once('value')).val()
    loadComputerSelector(dbobject)

});

function loadComputerSelector(dbobject) {
    const radioContainer = document.querySelector("#compselector")
    for (computer in dbobject) {
        radioContainer.innerHTML += `<input onclick ="loadTimeSelector('${computer}')" "id = "${computer}" type="radio" name="compselect" value = "${computer}"> <label for="${computer}">${computer}</label><br>`
    }
}

function loadTimeSelector(computer) {
    const radioContainer = document.querySelector("#timeselector")
    radioContainer.innerHTML=""
    for(timescale of ["1D","5D","1M","6M","1Y","5Y","MAX"]) {
        radioContainer.innerHTML+=`<input onclick ="loadGraph('${computer}','${timescale}')" "id = "${timescale}" type="radio" name="timeselect" value = "${timescale}"> <label for="${timescale}">${timescale}</label><br>`
    }
}