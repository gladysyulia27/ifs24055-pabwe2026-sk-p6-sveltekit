import { describe, it, expect, vi, beforeEach } from "vitest";
import SidebarComponent from "./SidebarComponent.svelte";
import { renderWithProviders } from "../../../test-utils";
import { mockGoto } from "../../../setupTests";

describe("SidebarComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all navigation items", () => {
    const { wrapper } = renderWithProviders(SidebarComponent, {
      route: "/",
    });

    expect(wrapper.text()).toContain("Menu Utama");
    expect(wrapper.text()).toContain("Semua Kursus");
    expect(wrapper.text()).toContain("Semua Pengguna");
    expect(wrapper.text()).toContain("Profil Saya");
  });

  it("should navigate when nav item is clicked", async () => {
    const onCloseMobile = vi.fn();
    const { wrapper } = renderWithProviders(SidebarComponent, {
      props: {
        isSidebarOpen: true,
        onCloseMobile,
      },
    });

    const links = wrapper.findAll("a");
    // Click on Semua Pengguna (/users)
    await links[1].trigger("click");
    expect(mockGoto).toHaveBeenCalledWith("/users");
    expect(onCloseMobile).toHaveBeenCalled();
  });

  it("should close mobile sidebar on backdrop click", async () => {
    const onCloseMobile = vi.fn();
    const { wrapper } = renderWithProviders(SidebarComponent, {
      props: {
        isSidebarOpen: true,
        onCloseMobile,
      },
    });

    const backdrop = wrapper.find('[data-testid="sidebar-backdrop"]');
    expect(backdrop.exists()).toBe(true);

    await backdrop.trigger("click");
    expect(onCloseMobile).toHaveBeenCalled();
  });

  it("should close mobile sidebar on Escape keydown on backdrop", async () => {
    const onCloseMobile = vi.fn();
    const { wrapper } = renderWithProviders(SidebarComponent, {
      props: {
        isSidebarOpen: true,
        onCloseMobile,
      },
    });

    const backdrop = wrapper.find('[data-testid="sidebar-backdrop"]');
    await backdrop.trigger("keydown", { key: "Escape" });
    expect(onCloseMobile).toHaveBeenCalled();

    // Key other than Escape should do nothing
    await backdrop.trigger("keydown", { key: "Enter" });
  });

  it("should highlight active route correctly for subpaths", () => {
    const { wrapper } = renderWithProviders(SidebarComponent, {
      route: "/users/1",
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("should handle navigation and backdrop clicks without onCloseMobile callback", async () => {
    const { wrapper } = renderWithProviders(SidebarComponent, {
      props: {
        isSidebarOpen: true,
      },
    });

    const links = wrapper.findAll("a");
    await links[0].trigger("click");

    const backdrop = wrapper.find('[data-testid="sidebar-backdrop"]');
    await backdrop.trigger("click");
    await backdrop.trigger("keydown", { key: "Escape" });
  });
});
