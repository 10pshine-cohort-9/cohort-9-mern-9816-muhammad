import { expect } from "chai";
import sinon from "sinon";

import UserProfile from "../models/UserProfileSchema.js";
import { cloudinary } from "../config/Cloudinary.js";
import {getProfile, updatedProfile } from "../controllers/ProfileController.js";

describe("Testing the Profile_Controller", function () {

    let sandbox;
    let req;
    let res;

    beforeEach(() => {

        sandbox = sinon.createSandbox();

        req = {
            UserId: "123456789",
            body: {
                Name: "Test Name",
                Email: "test@gmail.com",
                Tel: "03000000000",
                Gender: "Male",
                Dob: "0000-00-00",
                Address: {
                    house: "House 123",
                    CityState: "City"
                }
            },
            file: undefined
        }

        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub(),
            send: sandbox.stub()
        }
    })

    afterEach(() => {
        sandbox.restore();
    })

    describe("getProfile", function () {

        it("should get the user profile successfully", async function () {

            const profile = {
                UserId: "123456789",
                Name: "Test Name",
                Email: "test@gmail.com"

            }

            sandbox.stub(UserProfile, "findOne").resolves(profile);

            await getProfile(req, res);

            expect(UserProfile.findOne.calledOnce).to.equal(true);
            expect(UserProfile.findOne.calledWith({ UserId: "123456789" })).to.equal(true);
            expect(res.status.calledWith(200)).to.equal(true);
            expect(res.json.calledWith({ success: true, profile })).to.equal(true);

        })

        it("should return 404 if profile is not found", async function () {

            sandbox.stub(UserProfile, "findOne").resolves(null);

            await getProfile(req, res);

            expect(res.status.calledWith(404)).to.equal(true);
            expect(res.json.calledWith({ success: false, message: "profile not found"})).to.equal(true);

        })

        it("should return 500 if an error occurs while getting profile", async function () {

            sandbox.stub(UserProfile, "findOne").rejects(new Error("Database error"));

            await getProfile(req, res);

            expect(res.status.calledWith(500)).to.equal(true);
            expect(res.json.calledWith({ success: false, message: "User profile with that id is not found" })).to.equal(true);

        })

    })

    describe("updatedProfile", function () {

        it("should update the userProfile without image", async function () {

            const existingProfile = {
                UserId: "123456789",
                Name: "Old Name",
                Email: "old@gmail.com",
                Image: {
                    url: "old-image-url",
                    public_id: "NotesAppUsers/old-image"
                }
            };

            const editedProfile = {
                UserId: "123456789",
                Name: "Test Name",
                Email: "test@gmail.com",
                Tel: "03000000000",
                Gender: "Male",
                Dob: "0000-00-00",
                Address: {
                    house: "House 123",
                    CityState: "City"
                },
                Image: existingProfile.Image
            };

            sandbox.stub(UserProfile, "findOne").resolves(existingProfile);
            sandbox.stub(UserProfile, "findOneAndUpdate").resolves(editedProfile);

            await updatedProfile(req, res);

            expect(UserProfile.findOne.calledOnce).to.equal(true);
            expect(UserProfile.findOneAndUpdate.calledOnce).to.equal(true);
            expect(res.status.calledWith(200)).to.equal(true);
            expect(res.json.calledWith({ success: true, profile: editedProfile})).to.equal(true);

        });

    it("should return 404 if profile is not found during editing", async () => {

    const findOneStub = sinon.stub(UserProfile, "findOne").resolves(null);

    const req = {
        UserId: "123456789",
        body: {
            Name: "Test",
            Email: "test@gmail.com",
            Tel: "03000000000",
            Gender: "Male",
            Dob: "0000-00-00",
            Address: {
                house: "ABC",
                CityState: "City"
            }
        },
        file: undefined
    }

    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
    }

    await updatedProfile(req, res);

    expect(res.status.calledWith(404)).to.equal(true);
    expect(res.json.calledWith({ success: false, message: "Profile not found" })).to.equal(true);

    sinon.assert.calledOnce(findOneStub);

    findOneStub.restore();
})

    it("should return 404 if findOneAndUpdate does not return a profile", async function () {

        const existingProfile = {
            UserId: "123456789",
            Image: {
                public_id: "NotesAppUsers/old-image"
                }
            };

            sandbox.stub(UserProfile, "findOne").resolves(existingProfile);
            sandbox.stub(UserProfile, "findOneAndUpdate").resolves(null);

            await updatedProfile(req, res);

            expect(res.status.calledWith(404)).to.equal(true);
            expect(res.json.calledWith({
                    success: false,
                    message: "Profile not found"
                })).to.equal(true);
        });

    it("should return 500 if there is an error while updating profile", async function () {

        const existingProfile = {
            UserId: "123456789",
            Image: {
                public_id: "NotesAppUsers/old-image"
                }
            };

            sandbox.stub(UserProfile, "findOne").resolves(existingProfile);
            sandbox.stub(UserProfile, "findOneAndUpdate").rejects(new Error("Database update failed"));

            await updatedProfile(req, res);

            expect(res.status.calledWith(500)).to.equal(true);
            expect(res.json.calledWith({
                    success: false,
                    message: "Database update failed"
                })).to.equal(true);
            })        

    it("should update profile with a new image successfully", async function () {

        req.file = {
            originalname: "new-profile.jpg",
            buffer: Buffer.from("fake image")
            };

        const existingProfile = {
            UserId: "123456789",
            Image: {
                url: "old-image-url",
                public_id: "NotesAppUsers/old-image"
                }
            }

        const cloudinaryResult = {
            secure_url: "https://cloudinary.com/new-profile.jpg",
            public_id: "NotesAppUsers/new-profile"
            };

        const editedProfile = {
            UserId: "123456789",
            Name: "Test Name",
            Email: "test@gmail.com",
            Image: {
                url: cloudinaryResult.secure_url,
                fileName: "new-profile.jpg",
                public_id: cloudinaryResult.public_id
                }
            };

        sandbox.stub(UserProfile, "findOne").resolves(existingProfile);

        const uploadStream = {
            end: sandbox.stub()
        }

        sandbox.stub(cloudinary.uploader, "upload_stream").callsFake((options, callback) => {
            callback(null, cloudinaryResult);
            return uploadStream;
         });
        sandbox.stub(UserProfile, "findOneAndUpdate").resolves(editedProfile);
        sandbox.stub(cloudinary.uploader, "destroy").resolves({ result: "ok" });

        await updatedProfile(req, res);

        expect(cloudinary.uploader.upload_stream.calledOnce).to.equal(true);
        expect(uploadStream.end.calledOnce).to.equal(true);
        expect(UserProfile.findOne.calledOnce).to.equal(true);
        expect(UserProfile.findOneAndUpdate.calledOnce).to.equal(true);
        expect(cloudinary.uploader.destroy.calledOnce).to.equal(true);
        expect(cloudinary.uploader.destroy.calledWith("NotesAppUsers/old-image")).to.equal(true);
        expect(res.status.calledWith(200)).to.equal(true);
        expect(res.json.calledWith({
                    success: true,
                    profile: editedProfile
                })).to.equal(true);
        });

    it("should return 500 if Cloudinary upload fails", async () => {

    const uploadStreamStub = sinon.stub( cloudinary.uploader, "upload_stream").callsFake((options, callback) => {
        callback({ message: "Cloudinary upload failed" }, null);
        return {
            end: sinon.stub()
        }
    })

    const req = {
        UserId: "123456789",
        body: {
            Name: "Test",
            Email: "test@gmail.com",
            Tel: "03000000000",
            Gender: "Male",
            Dob: "0000-00-00",
            Address: {
                house: "ABC",
                CityState: "City"
            }
        },
        file: {
        originalname: "profile.jpg",
        buffer: Buffer.from("fake image")
        }
    }

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updatedProfile(req, res);

    expect(res.status.calledWith(500)).to.equal(true);
    expect(res.json.calledWith({
        success: false,
        message: "Cloudinary upload failed"
    })).to.equal(true);

    sinon.assert.calledOnce(uploadStreamStub);

    uploadStreamStub.restore();
})

  it("should delete the old Cloudinary image after successful replacement", async function () {

    req.file = {
     originalname: "new-profile.jpg",
     buffer: Buffer.from("fake image")
   };

    const existingProfile = {
        UserId: "123456789",
        Image: {
            url: "old-image-url",
            public_id: "NotesAppUsers/old-image"
        }
        };

    const cloudinaryResult = {
        secure_url: "https://cloudinary.com/new-profile.jpg",
        public_id: "NotesAppUsers/new-profile"
        };

    const editedProfile = {
        UserId: "123456789",
        Image: {
            url: cloudinaryResult.secure_url,
            fileName: "new-profile.jpg",
            public_id: cloudinaryResult.public_id
        }
    };

    sandbox.stub(UserProfile, "findOne").resolves(existingProfile);

    const uploadStream = { end: sandbox.stub() };

    sandbox.stub(cloudinary.uploader, "upload_stream").callsFake((options, callback) => {
        callback(null, cloudinaryResult);
        return uploadStream;
        })
    sandbox.stub(UserProfile, "findOneAndUpdate").resolves(editedProfile);

    const destroyStub = sandbox.stub(cloudinary.uploader, "destroy").resolves({ result: "ok" });

    await updatedProfile(req, res);

    expect(destroyStub.calledOnce).to.equal(true);
    expect(destroyStub.calledWith("NotesAppUsers/old-image")).to.equal(true);
    expect(res.status.calledWith(200)).to.equal(true);

        });

    });
  
})

