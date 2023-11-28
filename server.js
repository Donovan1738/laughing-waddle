const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

let instruments = [
    {
        id: 1,
        name: "Piano",
        description: "A delicate instrument that creates sound by hammers hitting strings",
        material: "Maple wood",
        img: "images/piano.jpg",
        parts: [
            "Keys",
            "Strings",
            "Pedals",
            "Hammers",
            "Dampers",
            "Frame",
        ],
    },
    { 
        id: 2,
        name: "Guitar",
        description: "A stringed instrument",
        material: "Spruce wood",
        img: "images/guitar.jpg",
        parts: [
            "Strings",
            "Frets",
            "Fretboard",
            "Tuners",
            "Stringpost",
            "Neck"
        ],
    },
    { 
        id: 3,
        name: "Drumset",
        description: "An instrument that creates rythms and holds the beat",
        material: "Birch wood",
        img: "images/drum.jpg",
        parts: [
            "Snare drum",
            "Hi-hat",
            "Crash cymbal",
            "Ride Cymbal",
            "Low tom",
            "High Tom",
        ],
    },
    { 
        id: 4,
        name: "Saxophone",
        description: "A woodwind instrument",
        material: "Brass",
        img: "images/sax.jpg",
        parts: [
            "Neck",
            "Body",
            "Reed",
            "Bell",
            "Mouth Piece",
            "Key Pearls",
        ],
    },
    { 
        id: 5,
        name: "Xylophone",
        description: "A percussion instrument made of wood",
        material: "Rosewood",
        img: "images/exylo.jpg",
        parts: [
            "Bars",
            "Resonating tubes",
            "Mallets",
            "Wheels",
            "Wood",
            "Keys",
        ],
    },
    {
        id: 6,
        name: "Trumpet",
        description: "A brass instrument",
        material: "Brass",
        img: "images/trumpet.jpg",
        parts: [
            "Mouth piece",
            "Lead pipe",
            "Bell",
            "Tuning slide",
            "Pistons",
            "Valves",
        ],
    },
];

app.get("/api/instruments", (req, res) => {
    res.send(instruments);
});

app.get("/api/instruments/:id", (req, res) => {
    const id = parseInt(req.params.id);
  
    const instrument = instruments.find((r)=>r.id === id);

    if (!instrument) {
        res.status(404).send("The instrument with the given id was not found");
    }

    res.send(instrument);
});

app.post("/api/instruments", upload.single("img"), (req,res) => {
    const result = validateInstrument(req.body);
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const instrument = {
        _id: instruments.length + 1,
        name: req.body.name,
        description: req.body.description,
        material: req.body.material,
        parts: req.body.parts.split(","),
    };

    // if (req.body.parts) {
    //     instrument.parts = req.body.parts.split(",");
    // }

    if (req.file) {
        instrument.img = "images/" + req.file.filename;
    }

    instruments.push(instrument);
    res.send(instrument);
});

app.put("/api/instruments/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);
  
    const instrument = instruments.find((r)=>r.id === id);

    const result = validateInstrument(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    instrument.name = req.body.name;
    instrument.description = req.body.description;
    instrument.material = req.body.material;
    instrument.parts = req.body.parts.split(",");

     if (req.file) {
        instrument.img = "images/" + req.file.filename;
    }

    res.send(instrument);
});

app.delete("/api/instruments/:id", (req, res) => {
    const id = parseInt(req.params.id);
  
    const instrument = instruments.find((r)=>r.id === id);

    if (!instrument) {
        res.status(404).send("The instrument with the given id was not found");
    }

    const index = instruments.indexOf(instrument);
    instruments.splice(index, 1);
    res.send(instrument);
});

const validateInstrument = (instrument) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        description: Joi.string().min(3).required(),
        material: Joi.string().min(3).required(),
        parts: Joi.allow(""),
    });

    return schema.validate(instrument);
};

app.listen(3000, () => {
    console.log("I'm listening");
});