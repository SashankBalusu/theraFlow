import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection , orderBy, query} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"; 
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
    // const docRef = doc(db, "therapists", localStorage.getItem("email").substring(1, localStorage.getItem("email").length-1));
    // const docSnap = await getDoc(docRef);
    // let dat = docSnap.data()
    // let patientEmailToName = {}
    let dataArr = []
    let labelArr = []
    const querySnapshot = await getDocs(collection(db, "patients"));
    querySnapshot.forEach((doc) => { 
        if (doc.data()["name"] == nameCurrPatient){
            let count = 1;
            for (let key in doc.data()["stats"]){
                console.log(doc.data()["stats"])
                dataArr.push(doc.data()["stats"][key]["reps"])
                labelArr.push(count)
                count++
            }
        }
        
    })
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let displayName = localStorage.getItem("displayName")
let photoURL = localStorage.getItem("photoURL")
document.getElementById("userSide").textContent = displayName.substring(1, displayName.length-1);
document.getElementById("profSide").src = photoURL.substring(1, photoURL.length-1);
document.getElementById("userTop").textContent = displayName.substring(1, displayName.length-1);
document.getElementById("profTop").src = photoURL.substring(1, photoURL.length-1);
const dashboardBut = document.getElementById("dashboardBut")

dashboardBut.addEventListener("click", async function(){
    hideAll()
    let elapsed = 0
    let reps = 0
    let repsByPatient = {}
    const db = getFirestore(app);  
    const docRef = doc(db, "therapists", localStorage.getItem("email").substring(1, localStorage.getItem("email").length-1));
    const docSnap = await getDoc(docRef);
    let dat = docSnap.data()
    
    const querySnapshot = await getDocs(collection(db, "patients"));
    querySnapshot.forEach((doc) => {
        let stats = doc.data()["stats"]
        console.log(stats)
        repsByPatient[doc.data()["name"]] = 0;
        for (let key in stats){
            repsByPatient[doc.data()["name"]] += stats[key]["reps"]
            reps += stats[key]["reps"]
            elapsed += stats[key]["endDate"]["seconds"] - stats[key]["startDate"]["seconds"]
        }
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
      });
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
    let phoneNumber = localStorage.getItem("phoneNumber") == null ? 0 :  localStorage.getItem("phoneNumber")
    document.getElementById("phoneNumber").textContent = "Phone Number: " + phoneNumber
    document.getElementById("creationTime").textContent = "Creation Time: " + localStorage.getItem("creationTime")
    document.getElementById("lastSignInTime").textContent = "Last Sign in Time:  " + localStorage.getItem("lastSignInTime")






})

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
    nameCurrPatient.textContent = patientEmailToName[patients[currInd]]
    createChart()
    moveLeftData.addEventListener("click", function(){
        if (currInd == 0){
            currInd = patients.length - 1
        }
        else {
            currInd --
        }
        nameCurrPatient.textContent = patientEmailToName[patients[currInd]]
        createChart()
    })
    moveRightData.addEventListener("click", function(){
        if (currInd == patients.length-1){
            currInd = 0
        }
        else {
            currInd++
        }
        nameCurrPatient.textContent = patientEmailToName[patients[currInd]]
        createChart()
    })
})

const calendarBut = document.getElementById("calendarBut")
calendarBut.addEventListener("click", async function(){
    hideAll()
    const calendarCon = document.getElementById("calendarCon")
    deleteAllChildNodes(calendarCon)
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
        deleteAllChildNodes(calendarCon)
        if (currInd == 0){
            currInd = patients.length - 1
        }
        else {
            currInd --
        }
        nameCurrCalendar.textContent = patients[currInd]
        // let h4 = document.createElement("h4")
        // h4.setAttribute("style", "margin-top: 20px;")
        // h4.textContent = patients[currInd]
        // calendarCon.appendChild(h4)
        let counter = 0
        const q = query(collection(db, "patients/" + patients[currInd] + "/schedule"), orderBy("date", "asc"));
        const querySnapshot = await getDocs(q)
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
    })
    moveRightCalendar.addEventListener("click", async function(){
        deleteAllChildNodes(calendarCon)
        if (currInd == patients.length-1){
            currInd = 0
        }
        else {
            currInd++
        }
        nameCurrCalendar.textContent = patients[currInd]
        // let h4 = document.createElement("h4")
        // h4.setAttribute("style", "margin-top: 20px;")
        // h4.textContent = patients[currInd]
        // calendarCon.appendChild(h4)
        let counter = 0
        const q = query(collection(db, "patients/" + patients[currInd] + "/schedule"), orderBy("date", "asc"));
        const querySnapshot = await getDocs(q)
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
        
    })
    
    
})