import {expect} from 'chai'
import sinon from 'sinon'
import NotesAppUsers from '../models/Users.js'
import UserProfile from '../models/UserProfileSchema.js'
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { signUp, Login } from '../controllers/authControllers.js'

describe('Authentication Controller', () => {
  afterEach( ()=> {
        sinon.restore();
      })

    describe('SignUp', () => {

        it("should create a user and profile successfully", async () => {
        
            const req = {
            body: {
                UserName: "TestName",
                Email: "test@gmail.com",
                Password: "testPass123"
            }
        }

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
            send: sinon.spy()
        }

        sinon.stub(bcrypt, "hash").resolves("hashed-password")

        sinon.stub(NotesAppUsers.prototype, "save").resolves()

        sinon.stub(UserProfile.prototype, "save").resolves()

        await signUp(req, res)

        expect(res.status.calledOnce).to.equal(true)
        const responseData = res.json.firstCall.args[0]
        expect(responseData.success).to.equal(true)
        expect(responseData.message).to.equal("Account Created Successfully!")
        

    })

    it("Should throw an error if duplicate email is entered", async () => {
        const req = {
            body: {
                UserName: "TestName",
                Email: "existing@gmail.com",
                Password: "testPass123"
            }
        }

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
            send: sinon.spy()
        }

        sinon.stub(bcrypt, "hash").resolves("hashed-password")
        sinon.stub(NotesAppUsers.prototype, "save").rejects(new Error("Duplicate Email"))
        
        await signUp(req, res);

        expect(res.status.calledOnce).to.equal(true)
        expect(res.status.firstCall.args[0]).to.equal(409)
        expect(res.send.calledOnce).to.equal(true)
        expect(res.send.firstCall.args[0]).to.equal("Add a unique email! This email already exists")

    })
    
})

    describe("Login", () => {

        it("Should login successfully for valid Email and Password", async () => {
            const req = {
                body: {
                    Email: "test@gmail.com",
                    Password: "testPass123"
                }  
            }

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy(),
                send: sinon.spy()
            }  

            const fakeUser = {
            _id: "123456789",
            Email: "test@example.com",
            encryptedPassword: "hashed-password"
        };

            sinon.stub(NotesAppUsers, "findOne").resolves(fakeUser)
            
            sinon.stub(bcrypt, "compare").resolves(true)
            sinon.stub(jwt, "sign").returns("fake-jwt-token")

            await Login(req, res);

            expect(res.status.calledOnce).to.equal(true)
            expect(res.status.firstCall.args[0]).to.equal(200)
            expect(res.json.calledOnce).to.equal(true)
            const Responsedata = res.json.firstCall.args[0]
            expect(Responsedata.success).to.equal(true)
            expect(Responsedata.message).to.equal("Login Successful! Welcome Back")
            expect(Responsedata.token).to.equal("fake-jwt-token")
        })

        it("should return 401 if email does not exist", async () => {

        const req = {
            body: {
                Email: "unknown@example.com",
                Password: "password123"
            }
        };


        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
            send: sinon.spy()
        };


        // Database returns no user
        sinon.stub(NotesAppUsers, "findOne")
            .resolves(null);


        // Run controller
        await Login(req, res);


        // Check status
        expect(res.status.calledOnce).to.equal(true);

        expect(
            res.status.firstCall.args[0]
        ).to.equal(401);


        // Check response
        expect(res.json.calledOnce).to.equal(true);

        const responseData = res.json.firstCall.args[0];


        expect(responseData.success)
            .to.equal(false);

        expect(responseData.message)
            .to.equal(
                "No account found with this email"
            );

    });


    // ==========================================
    // TEST 3: WRONG PASSWORD
    // ==========================================

    it("should return 401 if password is incorrect", async () => {

        const req = {
            body: {
                Email: "test@example.com",
                Password: "wrong-password"
            }
        };


        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
            send: sinon.spy()
        };


        const fakeUser = {
            _id: "123456789",
            Email: "test@example.com",
            encryptedPassword: "hashed-password"
        };


        // User exists
        sinon.stub(NotesAppUsers, "findOne")
            .resolves(fakeUser);


        // Password does NOT match
        sinon.stub(bcrypt, "compare")
            .resolves(false);


        // Run controller
        await Login(req, res);


        // Check status
        expect(res.status.calledOnce).to.equal(true);

        expect(
            res.status.firstCall.args[0]
        ).to.equal(401);


        // Check response
        expect(res.json.calledOnce).to.equal(true);

        const responseData = res.json.firstCall.args[0];


        expect(responseData.success)
            .to.equal(false);

        expect(responseData.message)
            .to.equal(
                "invalid email or password"
            );

    });
    })


});