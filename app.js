const bodyParser = require("body-parser");
const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");
mailchimp.setConfig({
    apiKey: "8df1a8571ae1ad4dfe5c48a8d95a95ed-us1",
    server: "us1",
});
const md5 = require("md5");

app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const fname = req.body.firstname;
    const lname = req.body.lastname;
    const email = req.body.email;
    const listId = "efe0ff67d8";
    const subscriberHash = md5(email.toLowerCase());
    const subscribingUser = {
        firstName: fname,
        lastName: lname,
        email: email,
    };

    async function runn() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName,
            },
        });

        res.send(
            `<h1>Successfully added you as an audience member. Your contact's id is ${response.id}.</h1>`
        );
    }
    async function run() {
        try {
            const response = await mailchimp.lists.getListMember(
                listId,
                subscriberHash
            );

            res.send(`<h1>You have already ${response.status}.</h1>`);
        } catch (e) {
            if (e.status === 404) {
                runn();
            }
        }
    }

    run();

    
    // console.log(fname + lname + email);
    // res.sendFile(__dirname + "/success.html");
});

app.listen("3000", function () {
    console.log("Server started....");
});