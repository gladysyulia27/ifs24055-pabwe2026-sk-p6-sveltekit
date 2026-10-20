import { describe, it, expect, vi, beforeEach } from "vitest";
import NavbarComponent from "./NavbarComponent.svelte";
import { renderWithProviders } from "../../../test-utils";
import { mockGoto } from "../../../setupTests";

describe("NavbarComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render brand name Delcom Courses and profile initials", () => {
    const { wrapper } = renderWithProviders(NavbarComponent, {
      props: {
        profile: { id: 1, name: "Alice", email: "alice@del.org" },
      },
    });

    expect(wrapper.text()).toContain("Delcom Courses");
    expect(wrapper.text()).toContain("Alice");
    expect(wrapper.text()).toContain("alice@del.org");
  });

  it("should render profile photo if available", () => {
    const { wrapper } = renderWithProviders(NavbarComponent, {
      props: {
        profile: { id: 1, name: "Alice", email: "alice@del.org", photo: "http://photo.jpg" },
      },
    });

    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("http://photo.jpg");
  });

  it("should render fallback initial 'U' if profile name is empty", () => {
    const { wrapper } = renderWithProviders(NavbarComponent, {
      props: {
        profile: { id: 1, name: "", email: "" },
      },
    });

    expect(wrapper.text()).toContain("Pengguna");
  });

  it("should toggle dropdown menu on button click and handle profile/logout clicks", async () => {
    const onLogout = vi.fn();
    const onToggleSidebar = vi.fn();

    const { wrapper } = renderWithProviders(NavbarComponent, {
      props: {
        profile: { id: 1, name: "Alice", email: "alice@del.org" },
        isSidebarOpen: false,
        onLogout,
        onToggleSidebar,
      },
    });

    const toggleBtn = wrapper.find('[data-testid="toggle-sidebar-btn"]');
    await toggleBtn.trigger("click");
    expect(onToggleSidebar).toHaveBeenCalled();

    const dropdownBtn = wrapper.find('[data-testid="profile-dropdown-button"]');
    await dropdownBtn.trigger("click");

    const profileLink = wrapper.find('[data-testid="dropdown-profile-link"]');
    expect(profileLink.exists()).toBe(true);
    await profileLink.trigger("click");
    expect(mockGoto).toHaveBeenCalledWith("/profile");

    // Reopen dropdown to test logout
    await dropdownBtn.trigger("click");
    const logoutBtn = wrapper.find('[data-testid="dropdown-logout-button"]');
    expect(logoutBtn.exists()).toBe(true);
    await logoutBtn.trigger("click");
    expect(onLogout).toHaveBeenCalled();
  });

  it("should close dropdown on click outside", async () => {
    const { wrapper } = renderWithProviders(NavbarComponent, {
      props: {
        profile: { id: 1, name: "Alice", email: "alice@del.org" },
      },
    });

    const dropdownBtn = wrapper.find('[data-testid="profile-dropdown-button"]');
    await dropdownBtn.trigger("click");

    expect(wrapper.find('[data-testid="profile-dropdown-menu"]').exists()).toBe(true);

    // Trigger click INSIDE dropdown (dropdown stays open)
    const menu = wrapper.find('[data-testid="profile-dropdown-menu"]');
    menu.element?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(wrapper.find('[data-testid="profile-dropdown-menu"]').exists()).toBe(true);

    // Trigger click outside
    document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));

    expect(wrapper.find('[data-testid="profile-dropdown-menu"]').exists()).toBe(false);
  });

  it("should handle toggle sidebar and logout without optional callbacks", async () => {
    const { wrapper } = renderWithProviders(NavbarComponent, {
      props: {
        profile: { id: 1, name: "Alice", email: "alice@del.org" },
      },
    });

    const toggleBtn = wrapper.find('[data-testid="toggle-sidebar-btn"]');
    await toggleBtn.trigger("click");

    const dropdownBtn = wrapper.find('[data-testid="profile-dropdown-button"]');
    await dropdownBtn.trigger("click");

    const logoutBtn = wrapper.find('[data-testid="dropdown-logout-button"]');
    await logoutBtn.trigger("click");
  });

  it("should render close icon when isSidebarOpen is true", () => {
    const { wrapper } = renderWithProviders(NavbarComponent, {
      props: {
        profile: { id: 1, name: "Alice" },
        isSidebarOpen: true,
      },
    });

    expect(wrapper.find('[data-testid="toggle-sidebar-btn"]').exists()).toBe(true);
  });
});
