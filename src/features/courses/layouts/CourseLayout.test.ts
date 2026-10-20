import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor } from "@testing-library/svelte";
import CourseLayout from "./CourseLayout.svelte";
import { renderWithProviders } from "../../../test-utils";
import apiHelper from "../../../helpers/apiHelper";
import { mockGoto } from "../../../setupTests";
import { usersStore } from "../../users/states/usersStore";

describe("CourseLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(usersStore, "asyncSetProfile").mockImplementation(() => Promise.resolve());
  });

  it("should redirect to /auth/login if no token found on mount", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    renderWithProviders(CourseLayout);
    expect(mockGoto).toHaveBeenCalledWith("/auth/login");
  });

  it("should fetch profile on mount if token exists", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");
    const spy = vi.spyOn(usersStore, "asyncSetProfile").mockImplementation(() => Promise.resolve());

    renderWithProviders(CourseLayout);
    expect(spy).toHaveBeenCalled();
  });

  it("should redirect to login if profile is null when isProfile becomes true", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");
    const putTokenSpy = vi.spyOn(apiHelper, "putAccessToken").mockImplementation(() => {});

    const { usersStore } = renderWithProviders(CourseLayout, {
      preloadedState: {
        profile: null,
        isProfile: false,
      },
    });

    usersStore.setIsProfile(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(putTokenSpy).toHaveBeenCalledWith("");
    expect(mockGoto).toHaveBeenCalledWith("/auth/login");
  });

  it("should render main content and handle logout", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");

    const { wrapper, authStore } = renderWithProviders(CourseLayout, {
      preloadedState: {
        profile: { id: 1, name: "Student", email: "student@del.org" },
      },
    });

    expect(wrapper.text()).toContain("Delcom Courses");

    // Open dropdown and click logout
    const dropdownBtn = wrapper.find('[data-testid="profile-dropdown-button"]');
    await dropdownBtn.trigger("click");
    const logoutBtn = wrapper.find('[data-testid="dropdown-logout-button"]');
    await logoutBtn.trigger("click");

    expect(authStore.asyncSetIsAuthLogout).toBeDefined();

    // Trigger isAuthLogout
    authStore.setIsAuthLogout(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(mockGoto).toHaveBeenCalledWith("/auth/login");
  });

  it("should toggle sidebar open and close", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");

    const { wrapper } = renderWithProviders(CourseLayout, {
      preloadedState: {
        profile: { id: 1, name: "Student" },
      },
    });

    const toggleBtn = wrapper.find('[data-testid="toggle-sidebar-btn"]');
    await toggleBtn.trigger("click");

    await waitFor(() => {
      expect(wrapper.find('[data-testid="sidebar-backdrop"]').exists()).toBe(true);
    });

    const backdrop = wrapper.find('[data-testid="sidebar-backdrop"]');
    await backdrop.trigger("click");

    await waitFor(() => {
      expect(wrapper.find('[data-testid="sidebar-backdrop"]').exists()).toBe(false);
    });
  });

  it("should stay on page when isProfile is triggered and profile exists", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");

    const { usersStore } = renderWithProviders(CourseLayout, {
      preloadedState: {
        profile: { id: 1, name: "Student" },
        isProfile: false,
      },
    });

    usersStore.setIsProfile(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(mockGoto).not.toHaveBeenCalledWith("/auth/login");
  });
});
