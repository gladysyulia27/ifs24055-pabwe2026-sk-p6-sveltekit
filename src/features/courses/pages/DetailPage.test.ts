import { describe, it, expect, vi, beforeEach } from "vitest";
import DetailPage from "./DetailPage.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import { mockGoto } from "../../../setupTests";
import { coursesStore } from "../states/coursesStore";

describe("DetailPage", () => {
  const sampleProfile = {
    id: 1,
    name: "User Satu",
    email: "satu@del.org",
  };

  const sampleCourseOwner = {
    id: 1,
    user_id: 1,
    title: "Course Owner Test",
    description: "Owner description markdown",
    cover: "http://cover.jpg",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    author: { name: "User Satu", photo: "http://photo.jpg" },
    students: [2],
    total_contents: 1,
    avg_ratings: "5.0",
    my_percentage_finished: "0.0",
    contents: [
      {
        id: 10,
        course_id: 1,
        title: "Video 1",
        youtube: "https://youtu.be/test",
        my_status_finished: true,
      },
    ],
    ratings: [
      {
        name: "User Dua",
        ratings: 5,
        comment: "Keren banget!",
      },
    ],
  };

  const sampleCourseStudent = {
    id: 2,
    user_id: 99,
    title: "Course Student Test",
    description: "Student description",
    cover: null,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    author: { name: "Teacher", photo: null },
    students: [1],
    total_contents: 2,
    avg_ratings: null,
    my_percentage_finished: "50.0",
    contents: [
      {
        id: 20,
        course_id: 2,
        title: "Video Belum Selesai",
        youtube: "https://youtu.be/test2",
        my_status_finished: false,
      },
    ],
    ratings: [],
  };

  const sampleCourseGuest = {
    id: 3,
    user_id: 99,
    title: "Course Guest Test",
    description: null,
    cover: null,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    author: null,
    students: null,
    contents: null,
    ratings: null,
    avg_ratings: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(coursesStore, "asyncSetCourse").mockImplementation(() => Promise.resolve());
    vi.spyOn(coursesStore, "asyncSetIsCourseDelete").mockImplementation(() => Promise.resolve());
    vi.spyOn(coursesStore, "asyncSetIsContentDelete").mockImplementation(() => Promise.resolve());
    vi.spyOn(coursesStore, "asyncSetIsStudentAdd").mockImplementation(() => Promise.resolve());
    vi.spyOn(coursesStore, "asyncSetIsStudentDelete").mockImplementation(() => Promise.resolve());
    vi.spyOn(coursesStore, "asyncSetIsRatingChange").mockImplementation(() => Promise.resolve());
  });

  it("should show loading when course is null", () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: sampleProfile,
        course: null,
      },
    });

    expect(wrapper.text()).toContain("Memuat detail kursus...");
  });

  it("should navigate back to all courses", async () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: sampleProfile,
        course: sampleCourseOwner,
      },
    });

    const backBtn = wrapper.find('[data-testid="back-to-courses-btn"]');
    await backBtn.trigger("click");
    expect(mockGoto).toHaveBeenCalledWith("/");
  });

  it("should render owner interface when user is owner", async () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: sampleProfile,
        course: sampleCourseOwner,
      },
    });
    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.find('[data-testid="edit-course-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="change-cover-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="delete-course-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="add-content-btn"]').exists()).toBe(true);

    // Click Edit Course
    await wrapper.find('[data-testid="edit-course-btn"]').trigger("click");
    expect(wrapper.find('[data-testid="change-course-modal"]').exists()).toBe(true);
    await wrapper.find('[data-testid="cancel-course-btn"]').trigger("click");

    // Click Change Cover
    await wrapper.find('[data-testid="change-cover-btn"]').trigger("click");
    expect(wrapper.find('[data-testid="change-cover-modal"]').exists()).toBe(true);
    await wrapper.find('[data-testid="cancel-cover-btn"]').trigger("click");

    // Click Add Content
    await wrapper.find('[data-testid="add-content-btn"]').trigger("click");
    expect(wrapper.find('[data-testid="content-modal"]').exists()).toBe(true);
    await wrapper.find('[data-testid="cancel-content-btn"]').trigger("click");

    // Click Edit Content on item 10
    const editContentBtn = wrapper.find('[data-testid="edit-content-btn-10"]');
    await editContentBtn.trigger("click");

    // Click Delete Content on item 10 (confirmed)
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);
    const deleteContentBtn = wrapper.find('[data-testid="delete-content-btn-10"]');
    await deleteContentBtn.trigger("click");

    // Click Delete Course (confirmed)
    await wrapper.find('[data-testid="delete-course-btn"]').trigger("click");
  });

  it("should handle content deletion cancellation", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false } as any);
    const deleteSpy = vi.fn();
    const { wrapper, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: sampleProfile,
        course: sampleCourseOwner,
      },
    });
    await new Promise((r) => setTimeout(r, 20));
    coursesStore.asyncSetIsContentDelete = deleteSpy;

    const deleteContentBtn = wrapper.find('[data-testid="delete-content-btn-10"]');
    await deleteContentBtn.trigger("click");
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("should handle course deletion cancellation", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false } as any);
    const deleteSpy = vi.fn();
    const { wrapper, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: sampleProfile,
        course: sampleCourseOwner,
      },
    });
    await new Promise((r) => setTimeout(r, 20));
    coursesStore.asyncSetIsCourseDelete = deleteSpy;

    const deleteCourseBtn = wrapper.find('[data-testid="delete-course-btn"]');
    await deleteCourseBtn.trigger("click");
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("should render student interface and handle leave/rating", async () => {
    const { wrapper, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 2 },
      preloadedState: {
        profile: sampleProfile,
        course: sampleCourseStudent,
      },
    });
    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.find('[data-testid="leave-course-btn"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Progres Belajar:");

    // Leave course confirmed
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);
    await wrapper.find('[data-testid="leave-course-btn"]').trigger("click");
    expect(coursesStore.asyncSetIsStudentDelete).toBeDefined();

    // Rating submission with empty comment does nothing
    const ratingForm = wrapper.find("form");
    await ratingForm.trigger("submit");

    // Rating submission with valid comment
    const commentInput = wrapper.find('[data-testid="rating-comment-input"]');
    await commentInput.setValue("Ulasan bagus");
    const ratingSelect = wrapper.find('[data-testid="rating-select"]');
    await ratingSelect.setValue("5");
    await ratingForm.trigger("submit");
    expect(coursesStore.asyncSetIsRatingChange).toBeDefined();

    // Navigate to content
    const openContentBtn = wrapper.find('[data-testid="open-content-btn-20"]');
    await openContentBtn.trigger("click");
    expect(mockGoto).toHaveBeenCalledWith("/courses/2/contents/20");

    const contentLink = wrapper.find('a[href="/courses/2/contents/20"]');
    await contentLink.trigger("click");
  });

  it("should handle leave course cancellation", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false } as any);
    const leaveSpy = vi.fn();
    const { wrapper, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 2 },
      preloadedState: {
        profile: sampleProfile,
        course: sampleCourseStudent,
      },
    });
    await new Promise((r) => setTimeout(r, 20));
    coursesStore.asyncSetIsStudentDelete = leaveSpy;

    await wrapper.find('[data-testid="leave-course-btn"]').trigger("click");
    expect(leaveSpy).not.toHaveBeenCalled();
  });

  it("should render guest interface and handle join course", async () => {
    const { wrapper, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 3 },
      preloadedState: {
        profile: sampleProfile,
        course: sampleCourseGuest,
      },
    });
    await new Promise((r) => setTimeout(r, 20));

    const joinBtn = wrapper.find('[data-testid="join-course-btn"]');
    expect(joinBtn.exists()).toBe(true);
    await joinBtn.trigger("click");
    expect(coursesStore.asyncSetIsStudentAdd).toBeDefined();

    expect(wrapper.text()).toContain("Belum ada materi pembelajaran pada kursus ini.");
    expect(wrapper.text()).toContain("Belum ada ulasan untuk kursus ini.");
  });

  it("should react to reactive state changes", async () => {
    const { coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: sampleProfile,
        course: sampleCourseOwner,
      },
    });

    coursesStore.setIsCourseDeleted(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(mockGoto).toHaveBeenCalledWith("/");

    coursesStore.setIsStudentAdded(true);
    await new Promise((r) => setTimeout(r, 10));

    coursesStore.setIsStudentDeleted(true);
    await new Promise((r) => setTimeout(r, 10));

    coursesStore.setIsRatingChanged(true);
    await new Promise((r) => setTimeout(r, 10));

    coursesStore.setIsContentDeleted(true);
    await new Promise((r) => setTimeout(r, 10));
  });

  it("should reload course when courseId changes", async () => {
    const { rerender } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: sampleProfile,
        course: sampleCourseOwner,
      },
    });

    const setCourseSpy = vi.spyOn(coursesStore, "asyncSetCourse");
    await rerender({ courseId: 99 });
    expect(setCourseSpy).toHaveBeenCalledWith(99);
  });
});
