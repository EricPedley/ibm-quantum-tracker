var compName,timeSpan
function changeName(newName) {
    compName=newName;
    if(timeSpan)
        loadGraph(compName,timeSpan);
}
function changeTimeSpan(newTimeSpan) {
    timeSpan=newTimeSpan
    if(compName)
        loadGraph(compName,timeSpan);
}

async function loadGraph(name,timeSpan) {
    document.querySelector("#graph").innerHTML = "";
    const loadEl = document.querySelector('#load');
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = Math.max(
            document.documentElement["clientWidth"],
            document.body["scrollWidth"],
            document.documentElement["scrollWidth"],
            document.body["offsetWidth"],
            document.documentElement["offsetWidth"]
        )*0.9 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    // append the svg object to the body of the page
    var svg = d3.select("#graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    //Read the data
    const data = [];
    var max = 0;
    var min = -1
    function appendDataFromDB(days) {
        const todayms = Date.now()
        const dayms = 24*60*60*1000;//how many ms in 24 hours
        for(let offset=0;offset<days;offset++) {//for each day
            const currDate = new Date(todayms-offset*dayms)
            const yearmonth = `${currDate.getFullYear()}-${currDate.getMonth()+1}`
            const day = currDate.getDate()
            if(!dbobject[name][yearmonth])
                continue;
            const today = dbobject[name][yearmonth][day]||{}
            for (hour of Object.keys(today)) {//for each hour
                const jobs = today[hour]
                const d = {
                    date: `${yearmonth}-${day}-${hour}`,
                    value: `${jobs}`
                }
                if (jobs > max)
                    max = jobs
                if (min == -1 || jobs < min)
                    min = jobs
                data.push({ date: d3.timeParse("%Y-%m-%d-%H")(d.date), value: d.value })
            }
        }
    }
    //["1D","5D","1M","6M","1Y","5Y","MAX"]
    if(timeSpan=="1D") {
        appendDataFromDB(1);
    } else if(timeSpan=="5D") {
        appendDataFromDB(5);
        //convert to ms since unix epoch and subtract 24h then convert back to normal date, then parse month and year and day
    } else if(timeSpan=="1M") {
        appendDataFromDB(30);
    } else if(timeSpan=="6M") {
        appendDataFromDB(182);
    } else if(timeSpan=="1Y") {
        appendDataFromDB(365);
    } else if(timeSpan=="MAX") {
        //figure out how to implement this. MAX means use all available data for the computer
        alert("sorry, max timescale not implemented yet. :(")
        console.error("unimplemented case")
    } else {
        alert("sorry, unknwon timescale. :(")
        console.error("unknwon timescale")
    }

    data.sort((a, b) => {
        return Date.parse(a.date) - Date.parse(b.date)
    })
    console.log(data)
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // Add Y axis
    var y = d3.scaleLinear()
        .domain([min, max])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));
    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#a56FFF")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return x(d.date) })
            .y(function (d) { return y(d.value) })
        )
    // Add the points
    svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.date) })
        .attr("cy", function (d) { return y(d.value) })
        .attr("r", 5)
        .attr("fill", "#a56FFF")
        .append("svg:title")
        .text((d)=>{
            let dobj=new Date(d.date)
            return `${d.value} jobs at ${(dobj.getHours()<10)?`0${dobj.getHours()}`:dobj.getHours()}:00 on ${dobj.toString().slice(0,3)} ${dobj.getMonth()+1}/${dobj.getDate()}/${dobj.getFullYear()}`
        });

    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.firestore().doc('/foo/bar').get().then(() => { });
    // firebase.functions().httpsCallable('yourFunction')().then(() => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    // firebase.analytics(); // call to activate
    // firebase.analytics().logEvent('tutorial_completed');
    // firebase.performance(); // call to activate
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    try {
        let app = firebase.app();
        let features = [
            'auth',
            'database',
            'firestore',
            'functions',
            'messaging',
            'storage',
            'analytics',
            'remoteConfig',
            'performance',
        ].filter(feature => typeof app[feature] === 'function');
        loadEl.textContent = `Firebase SDK loaded with ${features.join(', ')}`;
    } catch (e) {
        console.error(e);
        loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
    }
}