import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import UserProfile from "./UserProfile";

jest.mock("axios");

jest.mock("../assets/assets", () => ({
  assets: {
    ImageUp: () => <span data-testid="image-up-icon">ImageUp</span>,
  },
}));

jest.mock("../utils/reactToastify", () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
  showWarning: jest.fn(),
}));

jest.mock("../context/AppContext.jsx", () => {
  const React = require("react");

  const setuserProfile = jest.fn();

  const userProfile = {
    Name: "Muhammad",
    Email: "muhammad@example.com",
    Tel: "03001234567",
    Gender: "Male",
    Dob: "2002-05-10",
    Address: { house: "Street 1", CityState: "Gujranwala, Punjab" },
    Image: {
      url: "https://example.com/profile.jpg",
    },
  };

  return {
    AppContext: React.createContext({
      BACKEND_URL: "http://localhost:4000/api",
      token: "test-token",
      userProfile,
      setuserProfile,
    }),
    setuserProfile,
  };
});

const { setuserProfile } = require("../context/AppContext.jsx");

const profile = {
  Name: "Muhammad",
  Email: "muhammad@example.com",
  Tel: "03001234567",
  Gender: "Male",
  Dob: "2002-05-10",
  Address: { house: "Street 1", CityState: "Gujranwala, Punjab" },
  Image: {
    url: "https://example.com/profile.jpg",
  },
};

describe("UserProfile", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();

    URL.createObjectURL = jest.fn(() => "blob:profile-image");
    URL.revokeObjectURL = jest.fn();
  });

  test("shows the user's profile information", async () => {
    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText("My Profile")).toBeInTheDocument();
      expect(screen.getByText("Muhammad")).toBeInTheDocument();
      expect(screen.getByText("muhammad@example.com")).toBeInTheDocument();
      expect(screen.getByText("03001234567")).toBeInTheDocument();
      expect(screen.getByText("Street 1")).toBeInTheDocument();
      expect(screen.getByText("Gujranwala, Punjab")).toBeInTheDocument();
      expect(screen.getByText("Male")).toBeInTheDocument();
      expect(screen.getByText("2002-05-10")).toBeInTheDocument();
    });
  });

  test("shows the Edit button when profile is not being edited", () => {
    render(<UserProfile />);

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  test("changes the profile into edit mode", async () => {
    render(<UserProfile />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(
      screen.getByRole("button", { name: "Save Changes" }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Muhammad")).toBeInTheDocument();
    expect(screen.getByDisplayValue("03001234567")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Street 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Gujranwala, Punjab")).toBeInTheDocument();

    expect(screen.getByRole("combobox")).toHaveValue("Male");
    expect(screen.getByDisplayValue("2002-05-10")).toBeInTheDocument();
  });

  test("allows the user to change profile fields", () => {
    render(<UserProfile />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const nameInput = screen.getByDisplayValue("Muhammad");
    const telInput = screen.getByDisplayValue("03001234567");
    const houseInput = screen.getByDisplayValue("Street 1");
    const cityInput = screen.getByDisplayValue("Gujranwala, Punjab");
    const genderInput = screen.getByRole("combobox");
    const dobInput = screen.getByDisplayValue("2002-05-10");

    fireEvent.change(nameInput, { target: { value: "Muhammad Ahmad" } });
    fireEvent.change(telInput, { target: { value: "03111234567" } });
    fireEvent.change(houseInput, { target: { value: "House 25" } });
    fireEvent.change(cityInput, { target: { value: "Lahore, Punjab" } });
    fireEvent.change(genderInput, { target: { value: "Female" } });
    fireEvent.change(dobInput, { target: { value: "2001-10-15" } });

    expect(nameInput).toHaveValue("Muhammad Ahmad");
    expect(telInput).toHaveValue("03111234567");
    expect(houseInput).toHaveValue("House 25");
    expect(cityInput).toHaveValue("Lahore, Punjab");
    expect(genderInput).toHaveValue("Female");
    expect(dobInput).toHaveValue("2001-10-15");
  });

  test("updates the profile successfully", async () => {
    const updatedProfile = {
      ...profile,
      Name: "Muhammad Ahmad",
    };

    axios.put.mockResolvedValue({
      data: {
        success: true,
        profile: updatedProfile,
      },
    });

    render(<UserProfile />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByDisplayValue("Muhammad"), {
      target: { value: "Muhammad Ahmad" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
    });

    const [url, formData, config] = axios.put.mock.calls[0];

    expect(url).toBe("http://localhost:4000/api/userdata/userprofile");

    expect(formData.get("Name")).toBe("Muhammad Ahmad");
    expect(formData.get("Email")).toBe("muhammad@example.com");
    expect(formData.get("Tel")).toBe("03001234567");
    expect(formData.get("Gender")).toBe("Male");
    expect(formData.get("Dob")).toBe("2002-05-10");
    expect(formData.get("Address[house]")).toBe("Street 1");
    expect(formData.get("Address[CityState]")).toBe("Gujranwala, Punjab");
    expect(config).toEqual({
      headers: {
        Authorization: "Bearer test-token",
      },
    });

    expect(setuserProfile).toHaveBeenCalledWith(updatedProfile);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    });
  });

  test("shows an error when profile update fails", async () => {
    const { showError } = require("../utils/reactToastify");

    axios.put.mockRejectedValue({
      response: {
        data: {
          message: "Profile update failed",
        },
      },
    });

    render(<UserProfile />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith("Profile update failed");
    });
  });

  test("warns when a selected file is not an image", async () => {
    const { showWarning } = require("../utils/reactToastify");

    render(<UserProfile />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const fileInput = document.getElementById("profileImage");

    const file = new File(["some text"], "document.txt", {
      type: "text/plain",
    });

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    expect(showWarning).toHaveBeenCalledWith("Please select a valid image");
  });

  test("warns when image is larger than 5MB", async () => {
    const { showWarning } = require("../utils/reactToastify");

    render(<UserProfile />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const fileInput = document.getElementById("profileImage");

    const largeFile = new File(
      [new ArrayBuffer(6 * 1024 * 1024)],
      "large-image.png",
      {
        type: "image/png",
      },
    );

    fireEvent.change(fileInput, {
      target: {
        files: [largeFile],
      },
    });

    expect(showWarning).toHaveBeenCalledWith("Image must be smaller than 5MB");
  });

  test("shows a preview after selecting an image", async () => {
    render(<UserProfile />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const fileInput = document.getElementById("profileImage");

    const imageFile = new File(["image data"], "profile.png", {
      type: "image/png",
    });

    fireEvent.change(fileInput, { target: { files: [imageFile] } });

    await waitFor(() => {
      const image = document.querySelector("img");

      expect(image).toHaveAttribute("src", "blob:profile-image");
    });

    expect(URL.createObjectURL).toHaveBeenCalledWith(imageFile);
  });

  test("changes gender from Male to Female", () => {
    render(<UserProfile />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const gender = screen.getByRole("combobox");

    fireEvent.change(gender, { target: { value: "Female" } });

    expect(gender).toHaveValue("Female");
  });

  test("sends the selected image with the profile update", async () => {
    axios.put.mockResolvedValue({
      data: {
        success: true,
        profile,
      },
    });

    render(<UserProfile />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const fileInput = document.getElementById("profileImage");

    const imageFile = new File(["image data"], "profile.png", {
      type: "image/png",
    });

    fireEvent.change(fileInput, { target: { files: [imageFile] } });

    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
    });

    const [, formData] = axios.put.mock.calls[0];

    expect(formData.get("Image")).toBe(imageFile);
  });
});
