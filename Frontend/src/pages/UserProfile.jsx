import React, { useState} from "react";
import { assets } from "../assets/assets";
import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useEffect } from "react";

const UserProfile = () => {
  const {BACKEND_URL, token, userProfile, setuserProfile} = useContext(AppContext)
  const [userData, setuserData] = useState({
    Name: "",
    Email:"",
    Tel:"",
    Gender:"",
    Dob:"",
    Address: {
      house:"",
      CityState:""
    },
    Image: null
  });
  const [Image, setImage] = useState(null)
  const [imageView, setimageView] = useState(null)
  console.log("Selected image:", Image);
  const [isEdit, setisEdit] = useState(false);

  const editedProfile = async () => {
    try {
      const formData = new FormData()
  formData.append("Name", userData.Name)
  formData.append("Email", userData.Email)
  formData.append("Tel", userData.Tel)
  formData.append("Gender", userData.Gender)
  formData.append("Dob", userData.Dob)
  formData.append("Address[house]", userData.Address.house)
  formData.append("Address[CityState]", userData.Address.CityState)

  if (Image) {
    formData.append("Image", Image)
  }  
      const response = await axios.put(BACKEND_URL + `/userdata/userprofile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if(response.data.success){
        setuserData(response.data.profile)
        setuserProfile(response.data.profile)
      }
      
    } catch (error) {
      console.log(error)
    }
    
  }
useEffect( ()=> {
  if (!Image) {
    setimageView(null);
    return
  }
  const imageUrl = URL.createObjectURL(Image)
  setimageView(imageUrl)

  return ()=> {
    URL.revokeObjectURL(imageUrl)
  }
}, [Image])

useEffect(() => {
    if (userProfile) {
        setuserData(userProfile);
    }
}, [userProfile]);

  return (
    <section className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 sm:mb-8">
          <span className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            My Account
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            View and Manage your Personal Information
          </p>
        </div>

        <div className="rounded-2xl border border-stone-300 bg-white p-6 sm:p-8 shadow-sm">
          {/*image and Name*/}
          <div className="flex flex-col items-center gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-center">
            {isEdit === false ? (
              <img
                src={imageView || userData?.Image?.url}
                alt={userData?.Name || "your image"}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-emerald-50"
              />
            ) : (
              <div className="group relative h-20 w-20 cursor-pointer">
                <img
                  src={imageView || userData?.Image?.url}
                  
                  className="h-20 w-20 rounded-full object-cover opacity-80 ring-4 ring-emerald-100"
                />

                <label htmlFor="profileImage" className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-stone-900/30">
                  <assets.ImageUp className="h-6 w-6 text-white" aria-hidden='true' />
                  <span className="sr-only">Choose Profile Image</span>
                </label>
                <input type="file" id="profileImage" accept="image/*" className="sr-only" onChange={(event) => setImage(event.target.files[0])} />
              </div>
            )}

            <div className="flex-1 text-center sm:text-left">
              {isEdit === false ? (
                <h2 className="text-lg sm:text-xl font-semibold">
                  {userData.Name}
                </h2>
              ) : (
                <input
                  type="text"
                  value={userData.Name}
                  onChange={(event) =>
                    setuserData((prev) => ({
                      ...prev,
                      Name: event.target.value,
                    }))
                  }
                  className="w-full max-w-xs rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
                />
              )}
            </div>

            <button
              onClick={async () => {
                if (isEdit === true) {
                  await editedProfile();
                  setisEdit(false)
                }
                else{
                  setisEdit(true)}}
                }
              className="w-full sm:w-auto shrink-0 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg active:translate-y-0.5"
            >
              {isEdit ? "Save Changes" : "Edit"}
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Contact Information
            </h3>
            <div className="mt-3 divide-y divide-stone-200">
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:items-center sm:gap-4">
                <span className="text-sm text-stone-700">Email Address</span>
                <div className="sm:col-span-2">
                  
                    <p className="text-sm text-stone-800">{userData.Email}</p>
                  
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:items-center sm:gap-4">
                <span className="text-sm text-stone-700">Tel</span>
                <div className="sm:col-span-2">
                  {isEdit === false ? (
                    <p className="text-sm text-stone-800">{userData.Tel}</p>
                  ) : (
                    <input
                      type="text"
                      value={userData.Tel}
                      onChange={(event) =>
                        setuserData((prev) => ({
                          ...prev,
                          Tel: event.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:items-center sm:gap-4">
                <span className="text-sm text-stone-700 sm:pt-2">Address</span>
                <div className="sm:col-span-2">
                  {isEdit === false ? (
                    <div className="text-sm text-stone-800">
                      <p>{userData?.Address?.house}</p>
                      <p>{userData?.Address?.CityState}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="Enter your street address"
                        value={userData?.Address?.house || ""}
                        onChange={(event) =>
                          setuserData((prev) => ({
                            ...prev,
                            Address: {
                              ...prev.Address,
                              house: event.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
                      />

                      <input
                        type="text"
                        placeholder="Enter city and state"
                        value={userData?.Address?.CityState || ""}
                        onChange={(event) =>
                          setuserData((prev) => ({
                            ...prev,
                            Address: {
                              ...prev.Address,
                              CityState: event.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Basic Information
            </h3>
            <div className="mt-3 divide-y divide-stone-200">
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:items-center sm:gap-4">
                <span>Gender</span>
                <div>
                  {isEdit === false ? (
                    <p className="text-sm text-stone-800">{userData.Gender}</p>
                  ) : (
                    <select
                      name="Gender"
                      id="gender"
                      value={userData.Gender}
                      onChange={(event) =>
                        setuserData((prev) => ({
                          ...prev,
                          Gender: event.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 sm:w-48"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:items-center sm:gap-4">
                <span>Date of Birth</span>
                <div className="sm:col-span-2">
                  {isEdit === false ? (
                    <p className="text-sm text-stone-800">{userData.Dob}</p>
                  ) : (
                    <input
                      type="date"
                      id="dob"
                      value={userData.Dob}
                      onChange={(event) =>
                        setuserData((prev) => ({
                          ...prev,
                          Dob: event.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 sm:w-48"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    
  );
};

export default UserProfile;
