import React, { useContext } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import AppContextProvider, { AppContext } from "./AppContext";

jest.mock("axios");

jest.mock("../utils/reactToastify", () => ({
  showSuccess: jest.fn(),
}));

jest.mock("../config", () => ({
  BACKEND_URL: "http://localhost:4000",
}));

import { showSuccess } from "../utils/reactToastify";

const TestComponent = () => {
  const { BACKEND_URL, token, login, logout, userProfile, setuserProfile } = useContext(AppContext);

  return (
    <div>
      <p data-testid="backend-url">{BACKEND_URL}</p>
      <p data-testid="token">{token || "no-token"}</p>
      <p data-testid="profile"> {userProfile ? userProfile.Name : "no-profile"} </p>

      <button onClick={() => login("new-test-token")}> Login </button>

      <button onClick={logout}> Logout </button>

      <button onClick={() => setuserProfile({
            Name: "Updated User"
          }) }
      > Set Profile
      </button>

    </div>
  )
};

const renderProvider = () => {
  return render(
    <AppContextProvider>
      <TestComponent />
    </AppContextProvider>
  )
};

describe("AppContext", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    localStorage.clear();

    axios.get.mockResolvedValue({ data: {
        profile: {
          Name: "Muhammad",
          Email: "muhammad@example.com"
        }
      }
    })
  });

  test("provides the backend URL through context", () => {
    
    renderProvider();

    expect(screen.getByTestId("backend-url")).toHaveTextContent("http://localhost:4000");

  });

  test("reads the token from localStorage when provider starts", () => {
    
    localStorage.setItem("token", "stored-token");

    renderProvider();

    expect(screen.getByTestId("token")).toHaveTextContent("stored-token");

  });

  test("starts without a token when localStorage has no token", () => {
    
    renderProvider();

    expect(screen.getByTestId("token")).toHaveTextContent("no-token");
    expect(screen.getByTestId("profile")).toHaveTextContent("no-profile");

  });

  test("login stores the token in localStorage", () => {
    
    renderProvider();

    fireEvent.click(screen.getByRole("button", { name: "Login" }))

    expect(localStorage.getItem("token")).toBe("new-test-token")

  });

  test("login updates the token in context", () => {
   
    renderProvider();

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByTestId("token")).toHaveTextContent("new-test-token")

  })

  test("fetches the user profile when a token exists", async () => {
    
    localStorage.setItem("token", "test-token");

    renderProvider();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    })

  });

  test("sends the token in the Authorization header", async () => {
    
    localStorage.setItem("token", "test-token");

    renderProvider();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:4000/userdata/userprofile",
        {
          headers: {
            Authorization: "Bearer test-token",
            signal: expect.any(AbortSignal)
          }
        }
      )
    })

  });

  test("stores the fetched profile in userProfile", async () => {
    
    localStorage.setItem("token", "test-token");

    renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId("profile")).toHaveTextContent("Muhammad")
    })

  });

  test("does not fetch profile when there is no token", () => {
    
    renderProvider();

    expect(axios.get).not.toHaveBeenCalled()

  });

  test("logout removes the token from localStorage", () => {
    
    localStorage.setItem("token", "test-token");

    renderProvider();

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));

    expect(localStorage.getItem("token")).toBeNull()

  });

  test("logout clears the token from context", () => {
    
    localStorage.setItem("token", "test-token");

    renderProvider();

    expect(screen.getByTestId("token")).toHaveTextContent("test-token");

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));

    expect(screen.getByTestId("token")).toHaveTextContent("no-token")

  });

  test("logout shows success notification", () => {
   
    localStorage.setItem("token", "test-token");

    renderProvider();

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));

    expect(showSuccess).toHaveBeenCalledWith("You are Logged Out successfully")

  });

  test("allows userProfile to be updated through context", async () => {
    
    renderProvider();

    fireEvent.click(screen.getByRole("button", { name: "Set Profile" }))

    await waitFor(() => {
      expect(screen.getByTestId("profile")).toHaveTextContent("Updated User")
    })

  });

  test("handles profile request failure without crashing", async () => {
    
    localStorage.setItem("token", "test-token");

    axios.get.mockRejectedValueOnce({response: {
        data: {
          message: "Unauthorized"
        }
      }
    });

    renderProvider();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId("token")).toHaveTextContent("test-token")
    expect(screen.getByTestId("profile")).toHaveTextContent( "no-profile")

  });

  test("aborts the profile request when provider unmounts", async () => {
   
    localStorage.setItem("token", "test-token");

    const { unmount } = renderProvider();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    const requestConfig = axios.get.mock.calls[0][1];

    expect(requestConfig.headers.signal).toBeInstanceOf(AbortSignal);

    unmount();

    expect(requestConfig.headers.signal.aborted).toBe(true)

  })

});