import { expect } from "chai";
import express, { json } from "express";
import  request  from 'supertest'
import jwt from 'jsonwebtoken'

import profileRoutes from "../routes/ProfileRoutes.js";

describe("Testing the Profile Routes", () => {

    let app; 
    let token;

    beforeEach(() => {

        app = express()
        app.use(express.json())
        app.use('/userdata', profileRoutes)

    token = jwt.sign({ id: '123456789' }, process.env.JWT_SECRET)
    });

    describe("GET /userdata/userprofile", () => {

        it("should pass authentication and reach the profile route", async () => {

            const response = await request(app).get("/userdata/userprofile").set(
                    "Authorization",
                    `Bearer ${token}`
                )

            expect(response.status).to.not.equal(401);
        })

        it("should reject the request when token is missing", async () => {

            const response = await request(app).get("/userdata/userprofile");

            expect(response.status).to.equal(401);
            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal("Token is not provided");
        });

        it("should reject the request when token is invalid", async () => {

            const response = await request(app).get("/userdata/userprofile").set(
                    "Authorization",
                    "Bearer invalid-token"
                );

            expect(response.status).to.equal(401);
            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal("Invalid or Expired Token");
        });

    })

    describe("PUT /userdata/userprofile", () => {

        it("should pass authentication and reach the update route", async () => {

            const response = await request(app).put("/userdata/userprofile").set(
                    "Authorization",
                    `Bearer ${token}`
                )
                .field("Name", "Test NAme")
                .field("Email", "test@gmail.com")
                .field("Tel", "0300000000")
                .field("Gender", "Male")
                .field("Dob", "0000-00-00")
                .field("Address[house]", "123")
                .field("Address[CityState]", "City");

            expect(response.status).to.not.equal(401)
        });

        it("should reject update when token is missing", async () => {

            const response = await request(app).put("/userdata/userprofile")
            .field("Name", "Test NAme")
            .field("Email", "test@gmail.com");

            expect(response.status).to.equal(401);
            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal("Token is not provided");
        });

        it("should reject update when token is invalid", async () => {

            const response = await request(app).put("/userdata/userprofile").set(
                    "Authorization",
                    "Bearer invalid-token"
                )
                .field("Name", "Test NAme")
                .field("Email", "test@gmail.com");

            expect(response.status).to.equal(401);
            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal("Invalid or Expired Token");
        });

    })

})