import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, collection , orderBy, query, where} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"; 
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

function hideAll(){
    const mainPanel = document.getElementsByClassName("main-panel")
    for (let i = 0; i < mainPanel.length;i++){
        mainPanel[i].setAttribute("style", "display: none;")
    }
}
function deleteAllChildNodes(parent){
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
      }
}
async function createChart(){
    const nameCurrPatient = document.getElementById("nameCurrPatient").textContent
    const db = getFirestore(app);  
    const docRef = doc(db, "therapists", localStorage.getItem("email").substring(1, localStorage.getItem("email").length-1));
    const docSnap = await getDoc(docRef);
    let dat = docSnap.data()
    let patients = []
    for (let key in dat["patientIDs"]){
        patients.push(dat["patientIDs"][key])
    }
    // const docRef = doc(db, "therapists", localStorage.getItem("email").substring(1, localStorage.getItem("email").length-1));
    // const docSnap = await getDoc(docRef);
    // let dat = docSnap.data()
    // let patientEmailToName = {}
    let dataArr = []
    let labelArr = []
    let targ
    for (let i = 0; i < patients.length; i++){
        if (nameCurrPatient == patients[i]){
            targ = i
            break
        }
    }
    const q = query(collection(db, "patients/" + patients[targ] + "/schedule"), where("completed", "!=", false))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => { 
            let count = 1;
            dataArr.push(doc.data()["reps"])
            labelArr.push(count)
            count++
        
    })
    console.log(dataArr)
    var chart    = document.getElementById('chart').getContext('2d'),
    gradient = chart.createLinearGradient(0, 0, 0, 450);

gradient.addColorStop(0, 'rgba(154, 85, 255, 0.5)');
gradient.addColorStop(1, 'rgba(218, 140, 255, 0.25)');


var data  = {
    labels: labelArr,
    datasets: [{
			label: 'Reps',
			backgroundColor: gradient,
			pointBackgroundColor: 'white',
			borderWidth: 1,
			borderColor: 'rgba(154, 85, 255, 0.5)',
			data: dataArr
    }]
};


var options = {
	responsive: true,
	maintainAspectRatio: true,
	animation: {
		easing: 'easeInOutQuad',
		duration: 520
	},
	scales: {
		xAxes: [{
			gridLines: {
				color: 'rgba(200, 200, 200, 0.05)',
				lineWidth: 1
			}
		}],
		yAxes: [{
			gridLines: {
				color: 'rgba(200, 200, 200, 0.08)',
				lineWidth: 1
			}
		}]
	},
	elements: {
		line: {
			tension: 0.4
		}
	},
	legend: {
		display: false
	},
	point: {
		backgroundColor: 'white'
	},
	tooltips: {
		titleFontFamily: 'Open Sans',
		backgroundColor: 'rgba(0,0,0,0.3)',
		titleFontColor: 'red',
		caretSize: 5,
		cornerRadius: 2,
		xPadding: 10,
		yPadding: 10
	}
};


var chartInstance = new Chart(chart, {
    type: 'line',
    data: data,
		options: options
});

}

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAiJQQtF-g05oTrM3MZor-jEC4uXDJWP7Y",
    authDomain: "theraflow-cb0cc.firebaseapp.com",
    projectId: "theraflow-cb0cc",
    storageBucket: "theraflow-cb0cc.appspot.com",
    messagingSenderId: "654850056739",
    appId: "1:654850056739:web:39ba1ec0a5f4c14c920796",
    measurementId: "G-JQ48XH19CT"
};
let used = false
// Initialize Firebase
const app = initializeApp(firebaseConfig);
let displayName = localStorage.getItem("displayName")
let photoURL = localStorage.getItem("photoURL")
document.getElementById("userSide").textContent = displayName.substring(1, displayName.length-1);
document.getElementById("profSide").src = photoURL.substring(1, photoURL.length-1);
document.getElementById("userTop").textContent = displayName.substring(1, displayName.length-1);
document.getElementById("profTop").src = photoURL.substring(1, photoURL.length-1);
const dashboardBut = document.getElementById("dashboardBut")
let qr_code_element = document.querySelector(".qr-code");

dashboardBut.addEventListener("click", async function(){
    hideAll()
    let elapsed = 0
    let reps = 0
    let repsByPatient = {}
    const db = getFirestore(app);  
    const docRef = doc(db, "therapists", localStorage.getItem("email").substring(1, localStorage.getItem("email").length-1));
    const docSnap = await getDoc(docRef);
    let dat = docSnap.data()
    let patients = []
    for (let key in dat["patientIDs"]){
        patients.push(dat["patientIDs"][key])
    }
    
    for (let i = 0; i < patients.length;i++){
        const q = query(collection(db, "patients/" + patients[i] + "/schedule"), where("completed", "!=", false))
        const querySnapshot = await getDocs(q);
        repsByPatient[patients[i]] = 0
        querySnapshot.forEach((doc) => {
            console.log(doc.data())
            reps += doc.data()["reps"]
            elapsed += doc.data()["duration"]
            repsByPatient[patients[i]] += reps
            // let stats = doc.data()["stats"]
            // console.log(stats)
            // repsByPatient[doc.data()["name"]] = 0;
            // for (let key in stats){
            //     repsByPatient[doc.data()["name"]] += stats[key]["reps"]
            //     reps += stats[key]["reps"]
            //     elapsed += stats[key]["endDate"]["seconds"] - stats[key]["startDate"]["seconds"]
            // }
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
          });
    }
    
    console.log(repsByPatient)
    const dashboard = document.getElementById("dashboard")
    dashboard.setAttribute("style", "display: block")
    console.log(dat["patientIDs"])
    document.getElementById("totPatients").textContent = Object.keys(dat["patientIDs"]).length
    document.getElementById("secSpent").textContent = elapsed
    document.getElementById("totReps").textContent = reps


    var ctx = document.getElementById("traffic-chart").getContext('2d');
    var gradientStrokeBlue = ctx.createLinearGradient(0, 0, 0, 181);
      gradientStrokeBlue.addColorStop(0, 'rgba(54, 215, 232, 1)');
      gradientStrokeBlue.addColorStop(1, 'rgba(177, 148, 250, 1)');
      var gradientLegendBlue = 'linear-gradient(to right, rgba(54, 215, 232, 1), rgba(177, 148, 250, 1))';

      var gradientStrokeRed = ctx.createLinearGradient(0, 0, 0, 50);
      gradientStrokeRed.addColorStop(0, 'rgba(255, 191, 150, 1)');
      gradientStrokeRed.addColorStop(1, 'rgba(254, 112, 150, 1)');
      var gradientLegendRed = 'linear-gradient(to right, rgba(255, 191, 150, 1), rgba(254, 112, 150, 1))';

      var gradientStrokeGreen = ctx.createLinearGradient(0, 0, 0, 300);
      gradientStrokeGreen.addColorStop(0, 'rgba(6, 185, 157, 1)');
      gradientStrokeGreen.addColorStop(1, 'rgba(132, 217, 210, 1)');
     
      var gradientStrokeViolet = ctx.createLinearGradient(0, 0, 0, 181);
      gradientStrokeViolet.addColorStop(0, 'rgba(218, 140, 255, 1)');
      gradientStrokeViolet.addColorStop(1, 'rgba(154, 85, 255, 1)');
      var gradientLegendViolet = 'linear-gradient(to right, rgba(218, 140, 255, 1), rgba(154, 85, 255, 1))';
      var gradientLegendGreen = 'linear-gradient(to right, rgba(6, 185, 157, 1), rgba(132, 217, 210, 1))';      
      let labelArr = []
      let dataArr = []
      for (let i = 0; i < Object.keys(repsByPatient).length;i++){
        labelArr.push(Object.keys(repsByPatient)[i])
        dataArr.push(repsByPatient[Object.keys(repsByPatient)[i]])

      }
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labelArr,
            datasets: [{    
                data: dataArr, // Specify the data values array
            
                backgroundColor: [
                            gradientStrokeBlue,
                            gradientStrokeGreen,
                            gradientStrokeRed,
                            gradientLegendViolet
                ],
                hoverBackgroundColor: [
                            gradientStrokeBlue,
                            gradientStrokeGreen,
                            gradientStrokeRed,
                            gradientLegendViolet

                ],
                borderColor: [
                            gradientStrokeBlue,
                            gradientStrokeGreen,
                            gradientStrokeRed,
                            gradientLegendViolet

                ],
                legendColor: [
                            gradientLegendBlue,
                            gradientLegendGreen,
                            gradientLegendRed,
                            gradientLegendViolet

                ], // Add custom color background (Points and Fill)
                borderWidth: 1 // Specify bar border width
            }]},         
        options: {
        responsive: false, // Instruct chart js to respond nicely.
        maintainAspectRatio: true, // Add to prevent default behaviour of full-width/height 

        }
});


})
document.getElementById("dashboardBut").click()


const profileBut = document.getElementById("profileBut")
profileBut.addEventListener("click", async function(){
    const db = getFirestore(app);
    const docRef = doc(db, "therapists", localStorage.getItem("email").substring(1, localStorage.getItem("email").length-1));
    const docSnap = await getDoc(docRef);
    let dat = docSnap.data()
    hideAll()
    const profile = document.getElementById("profile")
    profile.setAttribute("style", "display: block")
    document.getElementById("greeting").textContent = "Hello, " + displayName.substring(1, displayName.length-1);
    document.getElementById("email").textContent = "Email: " + localStorage.getItem("email").substring(1, localStorage.getItem("email").length-1);
    document.getElementById("emailVerified").textContent = "Email Verified? " + localStorage.getItem("emailVerified")
    document.getElementById("id").textContent = "Therapist ID: " + dat["id"]
    let phoneNumber = localStorage.getItem("phoneNumber") == "null" ? "n/a" :  localStorage.getItem("phoneNumber")
    document.getElementById("phoneNumber").textContent = "Phone Number: " + phoneNumber
    document.getElementById("creationTime").textContent = "Creation Time: " + localStorage.getItem("creationTime").substring(1, localStorage.getItem("creationTime").length - 14)
    document.getElementById("lastSignInTime").textContent = "Last Sign in Time:  " + localStorage.getItem("lastSignInTime").substring(1, localStorage.getItem("lastSignInTime").length - 14)
    generate(localStorage.getItem("email").substring(1, localStorage.getItem("email").length-1))
    used = true




})
function generate(user_input) {
    if (used == false){
        qr_code_element.style = "";

        var qrcode = new QRCode(qr_code_element, {
            text: `${user_input}`,
            width: 180, //128
            height: 180,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    


}
  

const manageBut = document.getElementById("manageBut")
manageBut.addEventListener("click", async function(){
    hideAll()
    document.getElementById("manage").setAttribute("style", "display: block;")
    const db = getFirestore(app);  
    const docRef = doc(db, "therapists", localStorage.getItem("email").substring(1, localStorage.getItem("email").length-1));
    const docSnap = await getDoc(docRef);
    let dat = docSnap.data()
    let patientEmailToName = {}
    const querySnapshot = await getDocs(collection(db, "patients"));
    querySnapshot.forEach((doc) => { 
        patientEmailToName[doc.id] = doc.data()["name"]
    })
    let tbody = document.getElementById("tbody")
    deleteAllChildNodes(tbody)
    let count = 1
    for (let key in dat["patientIDs"]){
        let tr = document.createElement("tr")
        if (count % 2 == 0){
            tr.classList.add("active-row")
        }
        let td = document.createElement("td")
        td.textContent = key
        let td2 = document.createElement("td")
        td2.textContent = patientEmailToName[dat["patientIDs"][key]]
        let td3 = document.createElement("td")
        td3.textContent = dat["patientIDs"][key]
        tr.appendChild(td)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tbody.appendChild(tr)
        count++
    }

})

const dataBut = document.getElementById("dataBut")
dataBut.addEventListener("click", async function(){
    hideAll()
    document.getElementById("data").setAttribute("style", "display: block;")
    const nameCurrPatient = document.getElementById("nameCurrPatient")
    const moveLeftData = document.getElementById("moveLeftData")
    const moveRightData = document.getElementById("moveRightData")
    const db = getFirestore(app);  
    const docRef = doc(db, "therapists", localStorage.getItem("email").substring(1, localStorage.getItem("email").length-1));
    const docSnap = await getDoc(docRef);
    let dat = docSnap.data()
    let patients = []
    for (let key in dat["patientIDs"]){
        patients.push(dat["patientIDs"][key])
    }
    let patientEmailToName = {}
    
    const querySnapshot = await getDocs(collection(db, "patients"));
    querySnapshot.forEach((doc) => { 
        patientEmailToName[doc.id] = doc.data()["name"]
    })
    let currInd = 0
    nameCurrPatient.textContent = patients[currInd]
    createChart()
    moveLeftData.addEventListener("click", function(){
        if (currInd == 0){
            currInd = patients.length - 1
        }
        else {
            currInd --
        }
        nameCurrPatient.textContent = patients[currInd]
        createChart()
    })
    moveRightData.addEventListener("click", function(){
        if (currInd == patients.length-1){
            currInd = 0
        }
        else {
            currInd++
        }
        nameCurrPatient.textContent = patients[currInd]
        createChart()
    })
})

const calendarBut = document.getElementById("calendarBut")
calendarBut.addEventListener("click", async function(){
    hideAll()
    const calendarCon = document.getElementById("calendarCon")
    const nameCurrCalendar = document.getElementById("nameCurrCalendar")
    const moveLeftCalendar = document.getElementById("moveLeftCalendar")
    const moveRightCalendar = document.getElementById("moveRightCalendar")
    document.getElementById("calendar").setAttribute("style", "display: block;")
    const db = getFirestore(app);  
    const docRef = doc(db, "therapists", localStorage.getItem("email").substring(1, localStorage.getItem("email").length-1));
    const docSnap = await getDoc(docRef);
    let dat = docSnap.data()
    let patients = []
    for (let key in dat["patientIDs"]){
        patients.push(dat["patientIDs"][key])
    }
    console.log(patients)
    let currInd = 0
    nameCurrCalendar.textContent = patients[currInd]
    // let h4 = document.createElement("h4")
    // h4.setAttribute("style", "margin-top: 20px;")
    // h4.textContent = patients[currInd]
    // calendarCon.appendChild(h4)
    let counter = 0
    const q = query(collection(db, "patients/" + patients[currInd] + "/schedule"), orderBy("date", "asc"));
    const querySnapshot = await getDocs(q)
    console.log(currInd)
    deleteAllChildNodes(calendarCon)
    querySnapshot.forEach((doc) => { 
        console.log(doc.data())
        if (doc.data()["completed"] == false && counter < 6){
            let div = document.createElement("div")
            let h5 = document.createElement("h5")
            h5.setAttribute("style", "display: inline-block; margin-right: 5%")
            h5.textContent = doc.data()["stretch"]
            let h52 = document.createElement("h5")
            h52.setAttribute("style", "display: inline-block; margin-right: 5%")

            h52.textContent = doc.data()["reps"] + " reps"
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            d.setUTCSeconds(doc.data()["date"]["seconds"])
            let h53 = document.createElement("h5")
            h53.setAttribute("style", "display: inline-block")

            h53.textContent = d.toDateString()
            div.setAttribute("style", "margin: 0 auto 20px")
            div.appendChild(h5)
            div.appendChild(h52)
            div.appendChild(h53)
            div.classList.add("event")
            calendarCon.appendChild(div)
            counter++
            if (counter > 6){
                return
            }
        }
    })
    if (counter == 0){
        let div = document.createElement("div")
        let h5 = document.createElement("h5")
        h5.textContent = "No upcoming events."
        div.setAttribute("style", "margin: 0 auto 20px")
        div.classList.add("event")
        div.appendChild(h5)
        calendarCon.appendChild(div)
    }
    moveLeftCalendar.addEventListener("click", async function(){
        if (currInd == 0){
            currInd = patients.length - 1
        }
        else {
            currInd --
        }
        console.log(currInd)
        nameCurrCalendar.textContent = patients[currInd]
        // let h4 = document.createElement("h4")
        // h4.setAttribute("style", "margin-top: 20px;")
        // h4.textContent = patients[currInd]
        // calendarCon.appendChild(h4)
        let counterIn = 0
        const q = query(collection(db, "patients/" + patients[currInd] + "/schedule"), orderBy("date", "asc"));
        const querySnapshot = await getDocs(q)
        deleteAllChildNodes(calendarCon)
        querySnapshot.forEach((doc) => { 
            console.log(doc.data())
            if (doc.data()["completed"] == false && counterIn < 6){
                let div = document.createElement("div")
                let h5 = document.createElement("h5")
                h5.setAttribute("style", "display: inline-block; margin-right: 5%")
                h5.textContent = doc.data()["stretch"]
                let h52 = document.createElement("h5")
                h52.setAttribute("style", "display: inline-block; margin-right: 5%")

                h52.textContent = doc.data()["reps"] + " reps"
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(doc.data()["date"]["seconds"])
                let h53 = document.createElement("h5")
                h53.setAttribute("style", "display: inline-block")

                h53.textContent = d.toDateString()
                div.setAttribute("style", "margin: 0 auto 20px")
                div.appendChild(h5)
                div.appendChild(h52)
                div.appendChild(h53)
                div.classList.add("event")
                calendarCon.appendChild(div)
                counterIn++
            }
            if (counterIn == 6){
                return
            }
        })
        if (counterIn == 0){
            let div = document.createElement("div")
            let h5 = document.createElement("h5")
            h5.textContent = "No upcoming events."
            div.setAttribute("style", "margin: 0 auto 20px")
            div.classList.add("event")
            div.appendChild(h5)
            calendarCon.appendChild(div)
        }
    })
    moveRightCalendar.addEventListener("click", async function(){
        if (currInd == patients.length-1){
            currInd = 0
        }
        else {
            currInd++
        }
        console.log(currInd)

        nameCurrCalendar.textContent = patients[currInd]
        // let h4 = document.createElement("h4")
        // h4.setAttribute("style", "margin-top: 20px;")
        // h4.textContent = patients[currInd]
        // calendarCon.appendChild(h4)
        let counterIn = 0
        const q = query(collection(db, "patients/" + patients[currInd] + "/schedule"), orderBy("date", "asc"));
        const querySnapshot = await getDocs(q)
        deleteAllChildNodes(calendarCon)
        querySnapshot.forEach((doc) => { 
            console.log(doc.data())
            if (doc.data()["completed"] == false && counterIn < 6){
                let div = document.createElement("div")
                let h5 = document.createElement("h5")
                h5.setAttribute("style", "display: inline-block; margin-right: 5%")
                h5.textContent = doc.data()["stretch"]
                let h52 = document.createElement("h5")
                h52.setAttribute("style", "display: inline-block; margin-right: 5%")

                h52.textContent = doc.data()["reps"] + " reps"
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(doc.data()["date"]["seconds"])
                let h53 = document.createElement("h5")
                h53.setAttribute("style", "display: inline-block")

                h53.textContent = d.toDateString()
                div.setAttribute("style", "margin: 0 auto 20px")
                div.appendChild(h5)
                div.appendChild(h52)
                div.appendChild(h53)
                div.classList.add("event")
                calendarCon.appendChild(div)
                counterIn++
            }
            if (counterIn == 6){
                return
            }
        })
        if (counterIn == 0){
            let div = document.createElement("div")
            let h5 = document.createElement("h5")
            h5.textContent = "No upcoming events."
            div.setAttribute("style", "margin: 0 auto 20px")
            div.classList.add("event")
            div.appendChild(h5)
            calendarCon.appendChild(div)
        }
        
    })
    
    
})

const analyzeBut = document.getElementById("analyzeBut")
analyzeBut.addEventListener("click", async function(){
    hideAll()
    document.getElementById("analyze").setAttribute("style", "display: block")
    const analyzeCon = document.getElementById("analyzeCon")
    const nameCurrAnalyze = document.getElementById("nameCurrAnalyze")
    const moveLeftAnalyze = document.getElementById("moveLeftAnalyze")
    const moveRightAnalyze = document.getElementById("moveRightAnalyze")
    //deleteAllChildNodes(analyzeCon)
    const db = getFirestore(app);  
    const docRef = doc(db, "therapists", localStorage.getItem("email").substring(1, localStorage.getItem("email").length-1));
    const docSnap = await getDoc(docRef);
    let dat = docSnap.data()
    let patients = []
    for (let key in dat["patientIDs"]){
        patients.push(dat["patientIDs"][key])
    }
    console.log(patients)
    let currInd = 0
    nameCurrAnalyze.textContent = patients[currInd]
    const appendTo = document.getElementById("appendTo")
    const appendToTwo = document.getElementById("appendToTwo")
    const notes = document.getElementById("notes")
    

    let counter = 0
    
    const querySnapshot = await getDocs(collection(db, "patients/" + patients[currInd] + "/textUpdates"))
    deleteAllChildNodes(appendTo)
    deleteAllChildNodes(appendToTwo)
    deleteAllChildNodes(notes)
    querySnapshot.forEach((doc) => { 
        console.log(doc.data())
        for (let i = 0; i < doc.data()["anatomy"].length; i++){
            let h2 = document.createElement("h2")
            h2.textContent = "- " + doc.data()["anatomy"][i]
            appendTo.appendChild(h2)
        }
        for (let i = 0; i <  doc.data()["symptoms"].length; i++){
            let h2 = document.createElement("h2")
            h2.textContent = "- " + doc.data()["symptoms"][i]
            appendToTwo.appendChild(h2)

        }
        notes.textContent = doc.data()["text"]
        
        counter++
    })
    if (counter == 0){
        let h2 = document.createElement("h2")
        h2.textContent = "N/A"
        let h22 = document.createElement("h2")
        h22.textContent = "N/A"
        let h23 = document.createElement("h2")
        h23.textContent = "N/A"
        appendTo.appendChild(h2)
        appendToTwo.appendChild(h22)
        notes.appendChild(h23)

    }
    moveLeftAnalyze.addEventListener("click", async function(){
        if (currInd == 0){
            currInd = patients.length - 1
        }
        else {
            currInd --
        }
        nameCurrAnalyze.textContent = patients[currInd]
        

    let counter = 0
    const querySnapshot = await getDocs(collection(db, "patients/" + patients[currInd] + "/textUpdates"))
    deleteAllChildNodes(appendTo)
    deleteAllChildNodes(appendToTwo)
    deleteAllChildNodes(notes)
    querySnapshot.forEach((doc) => { 
        console.log(doc.data())
        for (let i = 0; i < doc.data()["anatomy"].length; i++){
            let h2 = document.createElement("h2")
            h2.textContent = "- " + doc.data()["anatomy"][i]
            appendTo.appendChild(h2)
        }
        for (let i = 0; i <  doc.data()["symptoms"].length; i++){
            let h2 = document.createElement("h2")
            h2.textContent = "- " + doc.data()["symptoms"][i]
            appendToTwo.appendChild(h2)

        }
        notes.textContent = doc.data()["text"]
        
        counter++
    })
    if (counter == 0){
        let h2 = document.createElement("h2")
        h2.textContent = "N/A"
        let h22 = document.createElement("h2")
        h22.textContent = "N/A"
        let h23 = document.createElement("h2")
        h23.textContent = "N/A"
        appendTo.appendChild(h2)
        appendToTwo.appendChild(h22)
        notes.appendChild(h23)

    }
    })
    moveRightAnalyze.addEventListener("click", async function(){
        if (currInd == patients.length-1){
            currInd = 0
        }
        else {
            currInd++
        }
        nameCurrAnalyze.textContent = patients[currInd]
        

    let counter = 0
    const querySnapshot = await getDocs(collection(db, "patients/" + patients[currInd] + "/textUpdates"))
    deleteAllChildNodes(appendTo)
    deleteAllChildNodes(appendToTwo)
    deleteAllChildNodes(notes)
    querySnapshot.forEach((doc) => { 
        console.log(doc.data())
        for (let i = 0; i < doc.data()["anatomy"].length; i++){
            let h2 = document.createElement("h2")
            h2.textContent = "- " + doc.data()["anatomy"][i]
            appendTo.appendChild(h2)
        }
        for (let i = 0; i <  doc.data()["symptoms"].length; i++){
            let h2 = document.createElement("h2")
            h2.textContent = "- " + doc.data()["symptoms"][i]
            appendToTwo.appendChild(h2)

        }
        notes.textContent = doc.data()["text"]
        
        counter++
    })
    if (counter == 0){
        let h2 = document.createElement("h2")
        h2.textContent = "N/A"
        let h22 = document.createElement("h2")
        h22.textContent = "N/A"
        let h23 = document.createElement("h2")
        h23.textContent = "N/A"
        appendTo.appendChild(h2)
        appendToTwo.appendChild(h22)
        notes.appendChild(h23)

    }
    })
})

const watchBut = document.getElementById("watchBut")
watchBut.addEventListener("click", async function(){
    hideAll()
    const storage = getStorage();
    document.getElementById("watch").setAttribute("style", "display: block")
    const nameCurrWatch = document.getElementById("nameCurrWatch")
    const moveLeftWatch = document.getElementById("moveLeftWatch")
    const moveRightWatch = document.getElementById("moveRightWatch")

    const db = getFirestore(app);  
    const docRef = doc(db, "therapists", localStorage.getItem("email").substring(1, localStorage.getItem("email").length-1));
    const docSnap = await getDoc(docRef);
    let dat = docSnap.data()
    let patients = []
    for (let key in dat["patientIDs"]){
        patients.push(dat["patientIDs"][key])
    }
    let currInd = 0
    
    nameCurrWatch.textContent = patients[currInd]
    const q = query(collection(db, "patients/" + patients[currInd] + "/schedule"), where("completed", "!=", false))
    const querySnapshot = await getDocs(q);
    let imgSrc
    querySnapshot.forEach((doc) => {
        imgSrc = doc.id
        return
    })
    if (imgSrc){
        getDownloadURL(ref(storage, imgSrc))
        .then((url) => {
    
            const video = document.getElementById('myvid');
            video.setAttribute('src', url);
        })
    }
    
    moveLeftWatch.addEventListener("click", async function(){
        if (currInd == 0){
            currInd = patients.length - 1
        }
        else {
            currInd --
        }
        nameCurrWatch.textContent = patients[currInd]
        const q = query(collection(db, "patients/" + patients[currInd] + "/schedule"), where("completed", "!=", false))
        const querySnapshot = await getDocs(q);
        let imgSrc
        querySnapshot.forEach((doc) => {
            imgSrc = doc.id
            return
        })
        if (imgSrc){
            getDownloadURL(ref(storage, imgSrc))
            .then((url) => {
        
                const video = document.getElementById('myvid');
                video.setAttribute('src', url);
            })
        }
        
    })
    moveRightWatch.addEventListener("click", async function(){
        if (currInd == patients.length-1){
            currInd = 0
        }
        else {
            currInd++
        }
        nameCurrWatch.textContent = patients[currInd]
        const q = query(collection(db, "patients/" + patients[currInd] + "/schedule"), where("completed", "!=", false))
        const querySnapshot = await getDocs(q);
        let imgSrc
        querySnapshot.forEach((doc) => {
            imgSrc = doc.id
            return
        })
        if (imgSrc){
            getDownloadURL(ref(storage, imgSrc))
            .then((url) => {
        
                const video = document.getElementById('myvid');
                video.setAttribute('src', url);
            })
        }
        
    })
})