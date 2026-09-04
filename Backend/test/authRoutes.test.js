import { expect } from "chai";
import request from "supertest";
import express from "express";
import sinon from "sinon";

import authRoutes from "../routes/RegLog.js";
import NotesAppUsers from "../models/Users.js";
import UserProfile from "../models/UserProfileSchema.js";
import bcrypt from "bcrypt";

process.env.JWT_SECRET = "test-secret";

describe("Testing authRoutes", () => {

    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use("/auth", authRoutes);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("POST /auth/signup", () => {

        it("should create a new Account successfully", async () => {

            sinon.stub(bcrypt, "hash").resolves("hashedPassword");
            sinon.stub(NotesAppUsers.prototype, "save").resolves();
            sinon.stub(UserProfile.prototype, "save").resolves();

            const response = await request(app).post("/auth/signup").send({
                    UserName: "Test User",
                    Email: "test@gmail.com",
                    Password: "123456"
                });

            expect(response.status).to.equal(201);
            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal("Account Created Successfully!");
        });

        it("should return 409 when signup fails", async () => {

            sinon.stub(bcrypt, "hash").resolves("hashedPassword");
            sinon.stub(NotesAppUsers.prototype, "save").rejects(new Error("Duplicate email"));

            const response = await request(app).post("/auth/signup").send({
                    UserName: "Test User",
                    Email: "existing@gmail.com",
                    Password: "123456"
                });

            expect(response.status).to.equal(409);
            expect(response.text).to.equal("Add a unique email! This email already exists");
        });

    })

    describe("POST /auth/login", () => {

        it("should login successfully with valid email and password", async () => {

            const fakeUser = {
                _id: "123456789",
                Email: "test@gmail.com",
                encryptedPassword: "hashedPassword"
            };

            sinon.stub(NotesAppUsers, "findOne").resolves(fakeUser);
            sinon.stub(bcrypt, "compare").resolves(true);

            const response = await request(app).post("/auth/login").send({
                    Email: "test@gmail.com",
                    Password: "123456"
                });

            expect(response.status).to.equal(200);
            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal("Login Successful! Welcome Back");
            expect(response.body.token).to.be.a("string");
        })

        it("should return 401 when email does not exist", async () => {

            sinon.stub(NotesAppUsers, "findOne").resolves(null);

            const response = await request(app).post("/auth/login").send({
                    Email: "unknown@gmail.com",
                    Password: "123456"
                });

            expect(response.status).to.equal(401);
            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal("No account found with this email");
        });

        it("should return 401 when password is incorrect", async () => {

            const fakeUser = {
                _id: "123456789",
                Email: "test@gmail.com",
                encryptedPassword: "hashedPassword"
            }

            sinon.stub(NotesAppUsers, "findOne").resolves(fakeUser);
            sinon.stub(bcrypt, "compare").resolves(false);

            const response = await request(app).post("/auth/login").send({
                    Email: "test@gmail.com",
                    Password: "wrongPassword"
                });

            expect(response.status).to.equal(401);
            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal("invalid email or password");
        })

    });

})