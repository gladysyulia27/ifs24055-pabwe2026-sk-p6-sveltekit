import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "./HomePage.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import { mockGoto } from "../../../setupTests";
import { coursesStore } from "../states/coursesStore";

describe("HomePage", () => {
  const sampleProfile = {
    id: 1,
    name: "User Satu",
    email: "satu@del.org",
  };

  const sampleCourses = [
    {
      id: 1,
      user_id: 1,
      title: "React Fundamental",
      description: "Belajar React dari awal",
      cover: "http://cover1.jpg",
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-01T00:00:00.000Z",
      author: { name: "User Satu", photo: "http://photo.jpg" },
      students: [2],
      total_contents: 3,
      avg_ratings: "4.5",
    },
    {
      id: 2,
      user_id: 2,
      title: "Vue Fundamental",
      description: "Belajar Vue",
      cover: null,
      created_at: "2024-01-02T00:00:00.000Z",
      updated_at: "2024-01-02T00:00:00.000Z",
      author: { name: "User Dua", photo: null },
      students: [1],
      total_contents: 0,
      avg_ratings: null,
    },
    {
      id: 3,
      user_id: 99,
      title: "Guest Course",
      description: null,
      cover: null,
      created_at: "2024-01-03T00:00:00.000Z",
      updated_at: "2024-01-03T00:00:00.000Z",
      author: null,
      students: null,
      total_contents: 0,
      avg_ratings: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(coursesStore, "asyncSetCourses").mockImplementation(() => Promise.resolve());
    vi.spyOn(coursesStore, "asyncSetIsCourseDelete").mockImplementation(() => Promise.resolve());
    vi.spyOn(coursesStore, "asyncSetIsCourseDeleteAll").mockImplementation(() => Promise.resolve());
  });

  it("should not render content if profile is null", () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: { profile: null },
    });
    expect(wrapper.find('[data-testid="add-course-btn"]').exists()).toBe(false);
  });

  it("should render courses list, stats, and badges correctly", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: sampleProfile,
        courses: sampleCourses,
      },
    });
    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("Daftar Kursus");
    expect(wrapper.text()).toContain("React Fundamental");
    expect(wrapper.text()).toContain("Vue Fundamental");
    expect(wrapper.text()).toContain("Milik Saya");
    expect(wrapper.text()).toContain("Terdaftar");
  });

  it("should filter courses via search query", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: sampleProfile,
        courses: sampleCourses,
      },
    });
    await new Promise((r) => setTimeout(r, 20));

    const searchInput = wrapper.find('[data-testid="search-course-input"]');
    await searchInput.setValue("React");

    expect(wrapper.text()).toContain("React Fundamental");
    expect(wrapper.text()).not.toContain("Vue Fundamental");

    // Search query with no matches
    await searchInput.setValue("Angular");
    expect(wrapper.text()).toContain("Tidak ada kursus yang cocok dengan pencarian Anda.");
  });

  it("should toggle filter between Semua and Milik Saya", async () => {
    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: sampleProfile,
        courses: sampleCourses,
      },
    });
    await new Promise((r) => setTimeout(r, 20));

    const myBtn = wrapper.find('[data-testid="filter-my-btn"]');
    await myBtn.trigger("click");
    expect(coursesStore.asyncSetCourses).toBeDefined();

    const allBtn = wrapper.find('[data-testid="filter-all-btn"]');
    await allBtn.trigger("click");
  });

  it("should handle navigation to course detail", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: sampleProfile,
        courses: sampleCourses,
      },
    });
    await new Promise((r) => setTimeout(r, 20));

    const viewBtn = wrapper.find('[data-testid="view-course-btn-1"]');
    await viewBtn.trigger("click");
    expect(mockGoto).toHaveBeenCalledWith("/courses/1");

    // Also click title link
    const titleLink = wrapper.find('a[href="/courses/1"]');
    await titleLink.trigger("click");
  });

  it("should open AddModal on add button click", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: sampleProfile,
        courses: sampleCourses,
      },
    });
    await new Promise((r) => setTimeout(r, 20));

    const addBtn = wrapper.find('[data-testid="add-course-btn"]');
    await addBtn.trigger("click");
    expect(wrapper.find('[data-testid="add-course-modal"]').exists()).toBe(true);
    await wrapper.find('[data-testid="cancel-course-btn"]').trigger("click");
  });

  it("should open ChangeModal on edit button click", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: sampleProfile,
        courses: sampleCourses,
      },
    });
    await new Promise((r) => setTimeout(r, 20));

    const editBtn = wrapper.find('[data-testid="edit-course-btn-1"]');
    await editBtn.trigger("click");
    expect(wrapper.find('[data-testid="change-course-modal"]').exists()).toBe(true);
    await wrapper.find('[data-testid="cancel-course-btn"]').trigger("click");
  });

  it("should delete course when confirmed", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);
    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: sampleProfile,
        courses: sampleCourses,
      },
    });
    await new Promise((r) => setTimeout(r, 20));

    const deleteBtn = wrapper.find('[data-testid="delete-course-btn-1"]');
    await deleteBtn.trigger("click");
    expect(coursesStore.asyncSetIsCourseDelete).toBeDefined();
  });

  it("should not delete course when cancelled", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false } as any);
    const deleteSpy = vi.fn();
    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: sampleProfile,
        courses: sampleCourses,
      },
    });
    await new Promise((r) => setTimeout(r, 20));
    coursesStore.asyncSetIsCourseDelete = deleteSpy;

    const deleteBtn = wrapper.find('[data-testid="delete-course-btn-1"]');
    await deleteBtn.trigger("click");
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("should delete all courses when confirmed", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);
    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: sampleProfile,
        courses: sampleCourses,
      },
    });
    await new Promise((r) => setTimeout(r, 20));

    const deleteAllBtn = wrapper.find('[data-testid="delete-all-btn"]');
    await deleteAllBtn.trigger("click");
    expect(coursesStore.asyncSetIsCourseDeleteAll).toBeDefined();
  });

  it("should not delete all courses when cancelled", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false } as any);
    const deleteAllSpy = vi.fn();
    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: sampleProfile,
        courses: sampleCourses,
      },
    });
    await new Promise((r) => setTimeout(r, 20));
    coursesStore.asyncSetIsCourseDeleteAll = deleteAllSpy;

    const deleteAllBtn = wrapper.find('[data-testid="delete-all-btn"]');
    await deleteAllBtn.trigger("click");
    expect(deleteAllSpy).not.toHaveBeenCalled();
  });

  it("should react to isCourseDeleted and isCourseDeletedAll", async () => {
    const { coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: sampleProfile,
        courses: sampleCourses,
      },
    });
    await new Promise((r) => setTimeout(r, 20));

    coursesStore.setIsCourseDeleted(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(coursesStore.isCourseDeleted).toBe(false);

    coursesStore.setIsCourseDeletedAll(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(coursesStore.isCourseDeletedAll).toBe(false);
  });

  it("should render empty state when no courses exist", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: sampleProfile,
        courses: [],
      },
    });
    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("Belum ada kursus");
    expect(wrapper.find('[data-testid="delete-all-btn"]').exists()).toBe(false);
  });
});
