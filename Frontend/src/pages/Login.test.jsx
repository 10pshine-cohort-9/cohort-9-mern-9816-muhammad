import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"
import axios from "axios";
import Login from "./Login";
import { assets } from "../assets/assets";

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

//Getting the Mocked Modules
const toast = require('../utils/reactToastify')
const context = require('../context/AppContext')

//Helper Function
const renderLogin = () => {
    return render(
        <MemoryRouter> <Login/> </MemoryRouter>
    )
}
 
// ------------- Tests ------------------
describe('Login Page', () => {

  beforeEach ( ()=> {
    jest.clearAllMocks();
    axios.post.mockReset();
  })

  //Form Rendering
  test('should render Login Page correctly', () => {
    
    renderLogin()

    expect(screen.getByText("NOTESBOOK Login")).toBeInTheDocument()
    expect(screen.getByText("Welcome Back")).toBeInTheDocument()
    expect(screen.getByText("Please Login to access NOTESBOOK")).toBeInTheDocument()

    expect(screen.getByLabelText("Email Address")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", {name: "Login"})).toBeInTheDocument()

  })

test('email field is required', () => {
    renderLogin();

    const emailField = screen.getByLabelText("Email Address")
    expect(emailField).toBeRequired()
})

test('password field is required', () => {
  
    renderLogin();

    const passwordField = screen.getByLabelText("Password")
    expect(passwordField).toBeRequired()
})
  
test('should allow users to enter email and password', () => {
  
    renderLogin();

    const emailField = screen.getByLabelText("Email Address")
    expect(emailField).toBeRequired()

    const passwordField = screen.getByLabelText("Password")
    expect(passwordField).toBeRequired()

    fireEvent.change(emailField, { target: { value: 'test@example.com'}})
    fireEvent.change(passwordField, { target: { value: 'Password123'}})

    expect(emailField).toHaveValue("test@example.com")
    expect(passwordField).toHaveValue("Password123")

})

test('should Login successfully with valid credentials', async () => {
  axios.post.mockResolvedValue({data: {
    success: true,
    token: "fake-jwt-token"
  }})

    renderLogin()

    fireEvent.change(screen.getByLabelText("Email Address"), {target: { value: 'test@example.com'}})
    fireEvent.change(screen.getByLabelText("Password"), {target: { value: 'Password123'}})
    fireEvent.click(screen.getByRole("button", {name: "Login"}))

    await waitFor( ()=> {
        expect(axios.post).toHaveBeenCalledWith("http://localhost:4000/api/user/login", {
            Email: 'test@example.com',
            Password: 'Password123'
        })
        expect(context.AppContext).toBeDefined()
        expect(toast.showSuccess).toHaveBeenCalledWith("Login Successful")

    })
})

test('should show error when request failed', async () => {
  axios.post.mockRejectedValue({response:{ data: { message: 'Invalid email or password'}, }})

  renderLogin();

    fireEvent.change(screen.getByLabelText("Email Address"), {target: { value: 'wrong@example.com'}})
    fireEvent.change(screen.getByLabelText("Password"), {target: { value: 'WrongPassword123'}})
    fireEvent.click(screen.getByRole("button", {name: "Login"}))

    await waitFor( ()=> {
        expect(toast.showError).toHaveBeenCalledWith("Invalid email or password")
    })
})

test("toggles password visibility", () => {

        renderLogin();

        const passwordField = screen.getByLabelText("Password");

        expect( passwordField ).toHaveAttribute( "type", "password" )

        fireEvent.click(screen.getByRole("button", {name: "Show password"}))

        expect(passwordField).toHaveAttribute("type","text");

        expect(screen.getByRole("button", {name: "Hide password",})).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", {name: "Hide password",}))

        expect(passwordField).toHaveAttribute("type","password")
    })

test("have Create Account button", () => {

    renderLogin();

    expect(screen.getByRole("button", {name: "Create Account",})).toBeInTheDocument()
    
});

})
