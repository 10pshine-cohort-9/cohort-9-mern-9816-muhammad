import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import { AppContext } from "../context/AppContext";

jest.mock("../config", () => ({
  BACKEND_URL: "http://localhost:4000",
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockLogout = jest.fn();
const mockNavigate = jest.fn();

const renderNavbar = ({ token = null, userProfile = null } = {}) => {
  return render(
    <MemoryRouter>
      <AppContext.Provider value={{ token, logout: mockLogout, userProfile }}>
        <Navbar />
      </AppContext.Provider>
    </MemoryRouter>
  )
};

describe('Navbar Tests', () => {
  
beforeEach(() => {
  jest.clearAllMocks();
  useNavigate.mockReturnValue(mockNavigate);
});

test("renders the NOTESBOOK brand", () => {
  
  renderNavbar();

  expect(screen.getByText("NOTESBOOK")).toBeInTheDocument()

});

test("renders the main navigation links with correct routes", () => {
  
  renderNavbar();

  const homeLink = screen.getByRole("link", { name: "HOME" });
  const allNotesLink = screen.getByRole("link", { name: "ALL-NOTES" });
  const newNoteLink = screen.getByRole("link", { name: "NEW-NOTE" });

  expect(homeLink).toHaveAttribute("href", "/");
  expect(allNotesLink).toHaveAttribute("href", "/all-notes");
  expect(newNoteLink).toHaveAttribute("href", "/new-note")

});

test("shows SignUp button when user is logged out", () => {

  renderNavbar({ token: null });

  expect(screen.getByRole("button", { name: "SignUp" })).toBeInTheDocument();

})

test("navigates to signup page when SignUp is clicked", () => {
  
  renderNavbar({ token: null });

  const signupButton = screen.getByRole("button", { name: "SignUp" });

  fireEvent.click(signupButton);

  expect(mockNavigate).toHaveBeenCalledWith("/user/signup");

})

test("shows profile image when user is logged in", () => {
  renderNavbar({ token: "test-token", userProfile: {
      Name: "Muhammad",
      Image: {
        url: "https://example.com/profile.jpg"
      }
    }
  });

  expect(screen.getByAltText("your_image")).toHaveAttribute("src", "https://example.com/profile.jpg")

});

test("does not show SignUp button when user is logged in", () => {
  renderNavbar({ token: "test-token", userProfile: {
      Name: "Muhammad",
      Image: {
        url: "https://example.com/profile.jpg",
      }
    }
  });

  expect(screen.queryByRole("button", { name: "SignUp" })).not.toBeInTheDocument();

})

test("opens profile menu when profile button is clicked", () => {
  renderNavbar({ token: "test-token", userProfile: {
      Image: {
        url: "https://example.com/profile.jpg",
      }
    }
  });

  const profileButton = screen.getByRole("button", { name: "your_image" });

  fireEvent.click(profileButton);

  expect(screen.getByRole("button", { name: "My Profile" })).toBeInTheDocument();

  expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument()

});

test("closes profile menu when profile button is clicked again", () => {
  renderNavbar({token: "test-token", userProfile: {
      Image: {
        url: "https://example.com/profile.jpg"
      }
    }
  });

  const profileButton = screen.getByRole("button", {name: "your_image"});

  fireEvent.click(profileButton);

  expect(screen.getByRole("button", { name: "My Profile" })).toBeInTheDocument();

  fireEvent.click(profileButton);

  expect(screen.queryByRole("button", { name: "My Profile" })).not.toBeInTheDocument()

});

test("navigates to profile page when My Profile is clicked", () => {
  renderNavbar({token: "test-token", userProfile: {
      Image: {
        url: "https://example.com/profile.jpg"
      }
    }
  });

  const profileButton = screen.getByRole("button", {name: "your_image"});

  fireEvent.click(profileButton);

  const myProfileButton = screen.getByRole("button", {name: "My Profile" });

  fireEvent.click(myProfileButton);

  expect(mockNavigate).toHaveBeenCalledWith("/userdata/userprofile")

});

test("calls logout when Logout is clicked", () => {
  renderNavbar({token: "test-token", userProfile: {
      Image: {
        url: "https://example.com/profile.jpg"
      }
    }
  });

  const profileButton = screen.getByRole("button", {name: "your_image"});

  fireEvent.click(profileButton);

  const logoutButton = screen.getByRole("button", {name: "Logout"});

  fireEvent.click(logoutButton);

  expect(mockLogout).toHaveBeenCalledTimes(1)

});

test("navigates to home after logout", () => {
  renderNavbar({token: "test-token", userProfile: {
      Image: {
        url: "https://example.com/profile.jpg"
      }
    }
  });

  const profileButton = screen.getByRole("button", {name: "your_image"});

  fireEvent.click(profileButton);

  fireEvent.click(screen.getByRole("button", { name: "Logout" }));

  expect(mockNavigate).toHaveBeenCalledWith("/")

});

test("opens mobile menu when menu button is clicked", () => {
  
  renderNavbar();

  const menuButton = screen.getByRole("button", { name: "☰" });

  fireEvent.click(menuButton);

 expect(screen.getAllByText("NOTESBOOK").length).toBe(2); 
 expect(screen.getByRole("button", { name: "✕" })).toBeInTheDocument()

});

test("closes mobile menu when close button is clicked", () => {
  
  renderNavbar();

  const menuButton = screen.getByRole("button", {name: "☰"});

  fireEvent.click(menuButton);

  const closeButton = screen.getByRole("button", { name: "✕" });

  fireEvent.click(closeButton);

  expect(screen.queryByRole("button", { name: "✕" })).not.toBeInTheDocument()

});

test("mobile SignUp navigates to signup page", () => {
  
  renderNavbar({ token: null });

  fireEvent.click(screen.getByRole("button", { name: "☰" }));

  const signupButtons = screen.getAllByRole("button", {name: "SignUp" });

  fireEvent.click(signupButtons[signupButtons.length - 1]);

  expect(mockNavigate).toHaveBeenCalledWith("/user/signup")

});

test("opens mobile account menu when My Account is clicked", () => {
  renderNavbar({token: "test-token", userProfile: {
      Image: {
        url: "https://example.com/profile.jpg"
      }
    }
  });

  fireEvent.click(screen.getByRole("button", { name: "☰" }));

  const accountButton = screen.getByRole("button", {name: /My Account/i});

  fireEvent.click(accountButton);

  expect(screen.getAllByRole("button", { name: "My Profile" }).length).toBeGreaterThan(0);

  expect(screen.getAllByRole("button", { name: "Logout" }).length).toBeGreaterThan(0)

});

test("mobile My Profile navigates to profile and closes mobile menu", () => {
  renderNavbar({token: "test-token", userProfile: {
      Image: {
        url: "https://example.com/profile.jpg"
      }
    }
  });

  fireEvent.click(screen.getByRole("button", { name: "☰" }));

  fireEvent.click(screen.getByRole("button", { name: /My Account/i }));

  const profileButtons = screen.getAllByRole("button", {name: "My Profile"});

  fireEvent.click(profileButtons[profileButtons.length - 1]);

  expect(mockNavigate).toHaveBeenCalledWith("/userdata/userprofile");

  expect(screen.queryByRole("button", { name: "✕" })).not.toBeInTheDocument()

});

test("mobile Logout calls logout, navigates home, and closes menu", () => {
  renderNavbar({token: "test-token", userProfile: {
      Image: {
        url: "https://example.com/profile.jpg"
      }
    }
  });

  fireEvent.click(screen.getByRole("button", { name: "☰" }));

  fireEvent.click(screen.getByRole("button", { name: /My Account/i }));

  const logoutButtons = screen.getAllByRole("button", {name: "Logout"});

  fireEvent.click(logoutButtons[logoutButtons.length - 1]);

  expect(mockLogout).toHaveBeenCalledTimes(1);
  expect(mockNavigate).toHaveBeenCalledWith("/");

  expect(screen.queryByRole("button", { name: "✕" })).not.toBeInTheDocument()

})

});