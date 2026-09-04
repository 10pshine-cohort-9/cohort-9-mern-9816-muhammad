import {expect} from 'chai'
import sinon from 'sinon'
import jwt from 'jsonwebtoken'
import userAuthantication from '../middlewares/authMiddleware.js'
import { json } from 'express'

describe("Testing the User Authentication", () => {
    afterEach( ()=> {
        sinon.restore();
    })

    it("Should authenticate a user with a valid Token", async () => {
        
        const userId = '123456789'
        const testSecret = "test-secret-123";
        process.env.JWT_SECRET = testSecret;

        const token = jwt.sign(
            { id: userId }, testSecret)
        
        const req = {
            headers: {
                authorization: `Bearer ${token}`
            }
        }

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        const next = sinon.spy()

        await userAuthantication(req, res, next);
        
        expect(req.UserId).to.equal("123456789")
        expect(next.calledOnce).to.equal(true)
        expect(res.status.called).to.equal(false)
    }) 

    it("should return 401 when token is not provided", async () => {

        const req = {
            headers: {}
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const next = sinon.spy();

        // Run middleware
        await userAuthantication(req, res, next);

        // Check status
        expect(res.status.calledOnce).to.equal(true);

        expect(res.status.firstCall.args[0]).to.equal(401);

        // Check response
        expect(res.json.calledOnce).to.equal(true);

        const responseData = res.json.firstCall.args[0];

        expect(responseData.success).to.equal(false);

        expect(responseData.message).to.equal("Token is not provided");

        // next() should not be called
        expect(next.called).to.equal(false);

    });

    it("should return 401 when token is invalid or expired", async () => {

        const req = {
            headers: {
                authorization: "Bearer invalid-token"
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const next = sinon.spy();

        // Make jwt.verify throw an error
        sinon.stub(jwt, "verify").throws(new Error("Invalid token"));

        // Run middleware
        await userAuthantication(req, res, next);

        // Check status
        expect(res.status.calledOnce).to.equal(true);

        expect(res.status.firstCall.args[0]).to.equal(401);
        
        // Check response
        expect(res.json.calledOnce).to.equal(true);

        const responseData = res.json.firstCall.args[0];

        expect(responseData.success).to.equal(false);

        expect(responseData.message).to.equal("Invalid or Expired Token");

        // next() should not be called
        expect(next.called).to.equal(false);

    });
    
})