import React from "react"
import {screen, render, fireEvent, waitFor} from "@testing-library/react"
import { data, MemoryRouter, Route, Routes } from "react-router-dom"
import axios from "axios"
import { assets } from "../assets/assets"
import SignUp from "./SignUp"

//Mock the Axios
jest.mock("axios")

//Mock teh App Context
jest.mock("../context/AppContext", () => {
    const React = require('react')
    return{
        AppContext: React.createContext({
            login: jest.fn(),
            BACKEND_URL: "http://localhost:4000/api"
        })
    }
})

//Mock the Assets
jest.mock("../assets/assets", () => ({
    assets: {
        Eye: () => {
            <span data-testid = 'eye-icon'>Eye</span>
        },
        EyeOff: () => {
            <span data-testid = 'eye-off-icon'>EyeOff</span>
        }
    }
}))

//Mock the Toastify
jest.mock("../utils/reactToastify", () => ({
    showError: jest.fn(),    
    showSuccess: jest.fn(),    
    showWarning: jest.fn(),    
}))

const toast = require('../utils/reactToastify');

//Helper Function
const renderSignUp = () => {
    return render(
        <MemoryRouter> <SignUp/> </MemoryRouter>
    )
}

describe('SignUp Page', () => {
  
    beforeEach ( ()=> {
        jest.clearAllMocks();
        axios.post.mockReset();
    })

    test('should render SignUp Page correctly', () => {
        
        renderSignUp()
    
        expect(screen.getByText("NOTESBOOK Account")).toBeInTheDocument()
        expect(screen.getByRole("heading", {name: "Create Account"})).toBeInTheDocument()
        expect(screen.getByText("Please Create an Account to access NOTESBOOK")).toBeInTheDocument()
    
        expect(screen.getByLabelText("Full Name:")).toBeInTheDocument()
        expect(screen.getByLabelText("Email Address")).toBeInTheDocument()
        expect(screen.getByLabelText("Password")).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Create Account"})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Login here"})).toBeInTheDocument()
    
      })

    test('should required all signUp fields', () => {
      
        renderSignUp()

        expect(screen.getByLabelText("Full Name:")).toBeInTheDocument()
        expect(screen.getByLabelText("Email Address")).toBeInTheDocument()
        expect(screen.getByLabelText("Password")).toBeInTheDocument()
    })
    
    test('should allow user to enter SignUp Information', () => {
      
        renderSignUp()

        const UserNameField = screen.getByLabelText("Full Name:")
        expect(UserNameField).toBeRequired()

        const emailField = screen.getByLabelText("Email Address")
        expect(emailField).toBeRequired()

        const passwordField = screen.getByLabelText("Password")
        expect(passwordField).toBeRequired()

        fireEvent.change(UserNameField, { target: { value: 'Muhammad'}})
        fireEvent.change(emailField, { target: { value: 'test@example.com'}})
        fireEvent.change(passwordField, { target: { value: 'Password123'}})

        expect(UserNameField).toHaveValue("Muhammad")
        expect(emailField).toHaveValue("test@example.com")
        expect(passwordField).toHaveValue("Password123")
    })
    
    test('should throw warning for Invalid Email', () => {
      
        renderSignUp()

        fireEvent.change(screen.getByLabelText("Full Name:"), {target: { value: "Muhammad"}})
        fireEvent.change(screen.getByLabelText("Email Address"), {target: { value: 'invalid-email'}})
        fireEvent.change(screen.getByLabelText("Password"), {target: { value: 'Password123'}})

        const form = screen.getByRole("button", {name: "Create Account"}).closest("form")
        fireEvent.submit(form)

        expect(toast.showWarning).toHaveBeenCalledWith("Please enter a valid Email")
        expect(axios.post).not.toHaveBeenCalled()

    })

    test('should throw warning for Invalid Password', () => {
      
        renderSignUp()

        fireEvent.change(screen.getByLabelText("Full Name:"), {target: { value: "Muhammad"}})
        fireEvent.change(screen.getByLabelText("Email Address"), {target: { value: 'test@example.com'}})
        fireEvent.change(screen.getByLabelText("Password"), {target: { value: 'password'}})

        const form = screen.getByRole("button", {name: "Create Account"}).closest("form")
        fireEvent.submit(form)

        expect(toast.showWarning).toHaveBeenCalledWith("Password must be at least 8 characters and contain uppercase, lowercase and a number")
        expect(axios.post).not.toHaveBeenCalled()
    })
    
    test('should register a user successfully', async () => {
      
        axios.post.mockResolvedValue({ data: { success: true } })

        renderSignUp()

        fireEvent.change(screen.getByLabelText("Full Name:"), {target: { value: "Muhammad"}})
        fireEvent.change(screen.getByLabelText("Email Address"), {target: { value: 'test@example.com'}})
        fireEvent.change(screen.getByLabelText("Password"), {target: { value: 'Password@123'}})

        const form = screen.getByRole("button", {name: "Create Account"}).closest("form")
        fireEvent.submit(form)

        await waitFor( ()=> {
            expect(axios.post).toHaveBeenCalledWith("http://localhost:4000/api/user/signup", {
            UserName: "Muhammad",
            Email: 'test@example.com',
            Password: 'Password@123'
        })
            expect(toast.showSuccess).toHaveBeenCalledWith("You Are Registered successfully")
        })
    })
    
    test('should throw an error when signup is unsuccessful', async () => {
      
        axios.post.mockResolvedValue({ data: {
            success: false,
            message: "Email already exists"
        }})

        renderSignUp()

        fireEvent.change(screen.getByLabelText("Full Name:"), {target: { value: "Muhammad"}})
        fireEvent.change(screen.getByLabelText("Email Address"), {target: { value: 'test@example.com'}})
        fireEvent.change(screen.getByLabelText("Password"), {target: { value: 'Password@123'}})

        const form = screen.getByRole("button", {name: "Create Account"}).closest("form")
        fireEvent.submit(form)

        await waitFor( ()=> {
                expect(toast.showError).toHaveBeenCalledWith("Email already exists")
            })
    })

    test('should show error when Signup Request Failed', async () => {
      
        axios.post.mockRejectedValue({response:{ data: { message: 'Server Error'}, }})

        renderSignUp()

        fireEvent.change(screen.getByLabelText("Full Name:"), {target: { value: "Muhammad"}})
        fireEvent.change(screen.getByLabelText("Email Address"), {target: { value: 'test@example.com'}})
        fireEvent.change(screen.getByLabelText("Password"), {target: { value: 'Password@123'}})

        const form = screen.getByRole("button", {name: "Create Account"}).closest("form")
        fireEvent.submit(form)

        await waitFor( ()=> {
                expect(toast.showError).toHaveBeenCalledWith("Server Error")
            })
    })

    test('should toggle password visibility', () => {
      
        renderSignUp()
        
        const passwordField = screen.getByLabelText("Password");
        
        expect( passwordField ).toHaveAttribute( "type", "password" )
        
        fireEvent.click(screen.getByRole("button", {name: "Show password"}))
        
        expect(passwordField).toHaveAttribute("type","text");
        
        expect(screen.getByRole("button", {name: "Hide password",})).toBeInTheDocument();
        
        fireEvent.click(screen.getByRole("button", {name: "Hide password",}))
        
        expect(passwordField).toHaveAttribute("type","password")
    })
    
    test('should navigate to login page when Login here is clicked', () => {
      
        render(
            <MemoryRouter initialEntries={["/user/signup"]}> 
                <Routes> 
                    <Route path="/user/signup" element={<SignUp/>}/>
                    <Route path="/user/login" element={<div> Login Page </div>}/>
                </Routes>
            </MemoryRouter>
            )

        fireEvent.click(screen.getByRole("button", {name: "Login here"}))
    
        expect(screen.getByText("Login Page")).toBeInTheDocument()

    })
    
})
