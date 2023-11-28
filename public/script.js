const getInstruments = async () => {
    try {
        return (await fetch("https://node-project3.onrender.com/api/instruments")).json();
    } catch(error) {
        console.log(error);
    }
}

const showInstruments = async () => {
    let instruments = await getInstruments();
    let instrumentsDiv = document.getElementById("instrument-list");
    instrumentsDiv.innerHTML = "";
    instruments.forEach((instrument) => {
        const section = document.createElement("section");
        section.classList.add("instrument");
        instrumentsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = instrument.name;
        a.append(h3);

        if(instrument.img) {
            const img = document.createElement("img");
            section.append(img);
            img.src = "https://node-project3.onrender.com/" + instrument.img;
        }
        

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(instrument);
        };
    });
};

const displayDetails = (instrument) => {
    const instrumentDetails = document.getElementById("instrument-details");
    instrumentDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = instrument.name;
    instrumentDetails.append(h3);

    const dLink = document.createElement("a");
    dLink.innerHTML = "&#x2715;"
    instrumentDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;"
    instrumentDetails.append(eLink);
    eLink.id = "edit-link";
    
    const p = document.createElement("p");
    instrumentDetails.append(p);
    p.innerHTML = "<b>Instrument Desciption:</b> " + instrument.description;

    const p3 = document.createElement("p");
    instrumentDetails.append(p3);
    p3.innerHTML = "<b>Instrument Material:</b> " + instrument.material;

    const p2 = document.createElement("p");
    instrumentDetails.append(p2);
    p2.innerHTML = "<b>Instrument Parts:</b> " + instrument.parts;

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-edit-title").innerHTML = "Edit Instrument";
    }

    dLink.onclick = (e) => {
        e.preventDefault();
        deleteInstrument(instrument);
    }

    populateEditForm(instrument);
};

const deleteInstrument = async (instrument) => {
    let response = await fetch(`/api/instruments/${instrument.id}`, {
        method: "DELETE", 
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
    });

    if (response.status != 200) {
        console.log("error deleting");
        return;
    }

    let result = await response.json();
    showInstruments();
    document.getElementById("instrument-details").innerHTML = "";
    resetForm();
};

const populateEditForm = (instrument) => {
    const form = document.getElementById("add-edit-instrument-form");
    form._id.value = instrument.id;
    form.name.value = instrument.name;
    form.description.value = instrument.description;
    form.material.value = instrument.material;

    //add ingredients 
    populateParts(instrument.parts);
};

const populateParts = (parts) => {
    const partBoxes = document.getElementById("part-boxes");
    parts.forEach((part) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = part;
        partBoxes.append(input);
    });
};

const addEditInstrument = async (e) => {
    e.preventDefault();

    const form = document.getElementById("add-edit-instrument-form");
    const formData = new FormData(form);
    // formData.delete("img");
    formData.append("parts", getParts());
    // console.log(...formData);

    let response;
    //add new instrument
    if(form._id.value == -1) {
        formData.delete("_id");
        // console.log(...formData);

        response = await fetch("/api/instruments", {
            method: "POST",
            body: formData,
        });
    } else {
        // existing instrument
        response = await fetch(`https://node-project3.onrender.com/api/instruments/${form._id.value}`, {
            method: "PUT",
            body: formData,
        });
        // console.log("edit mode");
        // console.log(...formData);
    }

    if(response.status != 200) {
        console.log("Error contacting server");
        return;
    }
    instrument = await response.json();
   
    //edit mode
    if (form._id.value != -1) {
        displayDetails(instrument);
    };

    document.querySelector(".dialog").classList.add("transparent");
    resetForm();
    showInstruments();
};

const getParts = () => {
    const inputs = document.querySelectorAll("#part-boxes input");
    const parts = [];

    inputs.forEach((input)=> {
        parts.push(input.value);
    });
    return parts;
}

const resetForm = () => {
    const form = document.getElementById("add-edit-instrument-form");
    form.reset();
    form._id ="-1";
    document.getElementById("part-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Add A New Instrument";
    resetForm();
};

const addPart = (e) => {
    e.preventDefault();
    const partBoxes = document.getElementById("part-boxes");
    const input = document.createElement("input");
    input.type = "text";
    partBoxes.append(input);
};

window.onload = () => {
    showInstruments();
    document.getElementById("add-edit-instrument-form").onsubmit = addEditInstrument;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-part").onclick = addPart;
};